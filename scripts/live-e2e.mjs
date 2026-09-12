const API_BASE_URL = process.env.LIVE_E2E_API_BASE_URL ?? 'https://universal-matching-platform-api.onrender.com';
const REQUEST_TIMEOUT_MS = 30_000;

const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const password = `E2E-${unique}-Aa1!`;

async function request(path, { token, method = 'GET', body } = {}) {
  const headers = {};
  if (body !== undefined) headers['content-type'] = 'application/json';
  if (token) headers.authorization = `Bearer ${token}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await response.text();
    let payload = null;
    try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }
    if (!response.ok) {
      const detail = typeof payload === 'string' ? payload : JSON.stringify(payload);
      throw new Error(`${method} ${path} -> ${response.status}: ${detail}`);
    }
    return payload;
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error(`${method} ${path} -> timeout after ${REQUEST_TIMEOUT_MS}ms`);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function fieldsFromSchema(category) {
  const schema = category?.fieldSchema ?? {};
  const fields = {};
  for (const [key, rule] of Object.entries(schema)) {
    if (!rule?.required) continue;
    if (rule.kind === 'number') fields[key] = Math.max(rule.minimum ?? 1, 1);
    else if (rule.kind === 'boolean') fields[key] = true;
    else {
      const minimum = rule.minLength ?? 1;
      const value = `${key}-e2e`;
      fields[key] = value.length >= minimum ? value : value.padEnd(minimum, 'x');
    }
  }
  return fields;
}

async function registerAndSignIn(label) {
  const email = `live-e2e-${label}-${unique}@example.invalid`;
  console.log(`1/${label}: register`);
  await request('/auth/register', { method: 'POST', body: { email, password } });
  console.log(`2/${label}: sign-in`);
  const result = await request('/auth/sign-in', { method: 'POST', body: { email, password } });
  if (!result?.credential) throw new Error(`${label}: sign-in returned no credential`);
  console.log(`3/${label}: authenticated account`);
  const account = await request('/accounts/authenticated', { token: result.credential });
  return { email, token: result.credential, account };
}

async function main() {
  console.log(`LIVE E2E target: ${API_BASE_URL}`);
  const categories = await request('/profile-categories');
  if (!categories?.categories?.length) throw new Error('No profile categories available');
  const category = categories.categories[0];
  console.log(`category: ${category.id}`);

  const a = await registerAndSignIn('a');
  const b = await registerAndSignIn('b');

  console.log('4: profile bootstrap A');
  await request('/profiles/me', {
    token: a.token,
    method: 'POST',
    body: {
      categoryId: category.id,
      fields: fieldsFromSchema(category),
      geographicScope: { kind: 'global', countryCode: 'JP' },
    },
  });
  console.log('5: profile bootstrap B');
  await request('/profiles/me', {
    token: b.token,
    method: 'POST',
    body: {
      categoryId: category.id,
      fields: fieldsFromSchema(category),
      geographicScope: { kind: 'global', countryCode: 'JP' },
    },
  });

  console.log('6: discovery A -> B');
  const discoveryA = await request(`/discovery?categoryId=${encodeURIComponent(category.id)}&scope=global&countryCode=JP&limit=20`, { token: a.token });
  const candidateB = discoveryA.items?.find((item) => item.accountId === b.account.id);
  if (!candidateB) throw new Error('A could not discover B');

  console.log('7: A likes B');
  const firstDecision = await request('/matches/decision', {
    token: a.token,
    method: 'POST',
    body: { targetAccountId: b.account.id, decision: 'like', idempotencyKey: `e2e-a-${unique}` },
  });
  if (firstDecision.mutual) throw new Error('Unexpected mutual match before B likes A');

  console.log('8: discovery B -> A');
  const discoveryB = await request(`/discovery?categoryId=${encodeURIComponent(category.id)}&scope=global&countryCode=JP&limit=20`, { token: b.token });
  const candidateA = discoveryB.items?.find((item) => item.accountId === a.account.id);
  if (!candidateA) throw new Error('B could not discover A');

  console.log('9: B likes A -> mutual match');
  const secondDecision = await request('/matches/decision', {
    token: b.token,
    method: 'POST',
    body: { targetAccountId: a.account.id, decision: 'like', idempotencyKey: `e2e-b-${unique}` },
  });
  if (!secondDecision.mutual) throw new Error('Mutual match was not created');

  console.log('10: A match list');
  const matches = await request('/matches', { token: a.token });
  if (!matches.items?.some((item) => item.accountId === b.account.id)) throw new Error('A match list missing B');

  console.log('11: A creates mutual-match conversation');
  const conversation = await request('/conversations/from-mutual-match', {
    token: a.token,
    method: 'POST',
    body: { targetAccountId: b.account.id },
  });
  if (!conversation?.id) throw new Error('Conversation was not created');

  console.log('12: A sends message');
  const message = await request(`/conversations/${conversation.id}/messages`, {
    token: a.token,
    method: 'POST',
    body: { body: 'E2E live message' },
  });
  if (!message?.id) throw new Error('Message was not created');

  console.log('13: B receives message');
  const messages = await request(`/conversations/${conversation.id}/messages`, { token: b.token });
  if (!messages.messages?.some((item) => item.id === message.id)) throw new Error('B cannot read A message');

  console.log('14: B notification');
  const notifications = await request('/conversations/notifications', { token: b.token });
  const notification = notifications.notifications?.find((item) => item.kind === 'message' || item.kind === 'new_message');
  if (!notification) throw new Error('B has no message notification');

  console.log('15: B marks notification read');
  await request(`/conversations/notifications/${encodeURIComponent(notification.id)}/read`, {
    token: b.token,
    method: 'POST',
  });
  const notificationsAfter = await request('/conversations/notifications', { token: b.token });
  const updated = notificationsAfter.notifications?.find((item) => item.id === notification.id);
  if (!updated?.readAt) throw new Error('Notification did not become read');

  console.log('LIVE_E2E_RESULT=passed');
}

main().catch((error) => {
  console.error(`LIVE_E2E_RESULT=failed: ${error.message}`);
  process.exitCode = 1;
});
