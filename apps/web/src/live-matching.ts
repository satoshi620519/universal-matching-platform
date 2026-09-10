import {
  ApiError,
  createConversationFromMutualMatch,
  createMyProfile,
  decideMatch,
  discoverProfiles,
  getAuthenticatedAccount,
  getMyProfile,
  listMatchHistory,
  listMatches,
  listMessages,
  listNotifications,
  listProfileCategories,
  markNotificationRead,
  sendMessage,
  signIn,
  register,
  type Conversation,
  type DiscoveryProfile,
  type MatchProfile,
  type Message,
  type Notification,
  type ProfileCategory,
} from './api';

type LiveState = {
  accountId: string;
  profile: Awaited<ReturnType<typeof getMyProfile>>;
  categories: ProfileCategory[];
  candidates: DiscoveryProfile[];
  matches: MatchProfile[];
  notifications: Notification[];
  history: Awaited<ReturnType<typeof listMatchHistory>>['items'];
  currentIndex: number;
  activeMatch: MatchProfile | null;
  conversation: Conversation | null;
  messages: Message[];
};

const esc = (value: unknown) => String(value ?? '').replace(/[&<>'"]/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c] as string));
const fieldText = (profile: DiscoveryProfile | MatchProfile | null, key: string, fallback = '') => {
  const value = profile?.fields?.[key];
  return value == null ? fallback : String(value);
};
const displayName = (profile: DiscoveryProfile | MatchProfile) => fieldText(profile, 'name', fieldText(profile, 'displayName', 'ユーザー'));
const roleText = (profile: DiscoveryProfile | MatchProfile) => fieldText(profile, 'role', fieldText(profile, 'occupation', 'マッチ候補'));
const placeText = (profile: DiscoveryProfile | MatchProfile) => fieldText(profile, 'place', fieldText(profile, 'city', '地域未設定'));
const tagsText = (profile: DiscoveryProfile | MatchProfile) => {
  const raw = profile.fields?.interests ?? profile.fields?.tags ?? profile.fields?.skills;
  if (Array.isArray(raw)) return raw.map(String).join(' · ');
  return raw == null ? '' : String(raw);
};

function modalShell(title: string, body: string) {
  const existing = document.getElementById('nexaLiveModal');
  existing?.remove();
  const modal = document.createElement('div');
  modal.id = 'nexaLiveModal';
  modal.innerHTML = `<div class="nexa-live-modal-card"><div class="nexa-live-modal-head"><div><span>LIVE MATCHING</span><h3>${esc(title)}</h3></div><button data-live-close>×</button></div><div class="nexa-live-modal-body">${body}</div></div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal || (event.target as HTMLElement).closest('[data-live-close]')) modal.remove();
  });
  return modal;
}

function formModal(title: string, submitLabel: string, onSubmit: (email: string, password: string) => Promise<void>) {
  const modal = modalShell(title, `<form data-live-auth-form><label>メールアドレス<input name="email" type="email" autocomplete="email" required /></label><label>パスワード<input name="password" type="password" autocomplete="current-password" minlength="8" required /></label><button class="nexa-live-primary" type="submit">${esc(submitLabel)}</button><p data-live-error></p></form>`);
  modal.querySelector('form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const error = form.querySelector('[data-live-error]') as HTMLElement;
    const email = String(new FormData(form).get('email') ?? '');
    const password = String(new FormData(form).get('password') ?? '');
    error.textContent = '';
    try { await onSubmit(email, password); modal.remove(); } catch (err) { error.textContent = err instanceof Error ? err.message : '処理に失敗しました。'; }
  });
  return modal;
}

function renderLiveShell(root: HTMLElement, state: LiveState, setState: (patch: Partial<LiveState>) => void) {
  const candidate = state.candidates[state.currentIndex] ?? null;
  const current = state.activeMatch ?? candidate;
  const matches = state.matches;
  root.innerHTML = `<div class="nexa-live-bar"><div><span>LIVE API</span><strong>${esc(state.accountId.slice(0, 8))}</strong></div><button data-live-refresh>更新</button></div>
    <div class="nexa-live-nav"><button data-live-view="discover">探す</button><button data-live-view="matches">マッチ <b>${matches.length}</b></button><button data-live-view="messages">メッセージ</button><button data-live-view="notifications">通知 <b>${state.notifications.filter(n => !n.readAt).length}</b></button><button data-live-profile>プロフィール</button></div>
    <div class="nexa-live-content" data-live-content></div>`;

  const content = root.querySelector('[data-live-content]') as HTMLElement;
  const show = (html: string) => { content.innerHTML = html; };
  const refresh = async () => {
    const [matches, notifications, history] = await Promise.all([listMatches(), listNotifications(), listMatchHistory()]);
    setState({ matches: matches.items, notifications: notifications.notifications, history: history.items });
  };

  const renderDiscover = () => {
    if (!candidate) {
      show(`<div class="nexa-live-empty"><h3>候補がありません</h3><p>プロフィールと地域設定を確認してから再読み込みしてください。</p><button data-live-refresh>再読み込み</button></div>`);
      return;
    }
    show(`<div class="nexa-live-head"><span>AUTHORITATIVE DISCOVERY</span><h3>あなたに合う相手</h3><small>${state.currentIndex + 1} / ${state.candidates.length}</small></div>
      <article class="nexa-live-card"><div class="nexa-live-avatar">${esc(displayName(candidate).slice(0,1).toUpperCase())}</div><div><span>${esc(roleText(candidate))} · ${esc(placeText(candidate))}</span><h4>${esc(displayName(candidate))}</h4><p>${esc(tagsText(candidate))}</p></div></article>
      <div class="nexa-live-actions"><button data-live-pass>スキップ</button><button class="nexa-live-primary" data-live-like>♡ いいね</button><button data-live-next>次へ →</button></div>
      <div class="nexa-live-status">API永続化 · 相互マッチ判定 · 安全ルール適用</div>`);
  };

  const renderMatches = () => {
    show(`<div class="nexa-live-head"><span>PERSISTENT MATCHES</span><h3>マッチ一覧</h3><small>${matches.length} 件</small></div>${matches.length ? `<div class="nexa-live-list">${matches.map((m) => `<article><div><b>${esc(displayName(m))}</b><span>${esc(roleText(m))} · ${esc(placeText(m))}</span></div><button data-live-open-match="${esc(m.accountId)}">メッセージ</button></article>`).join('')}</div>` : `<div class="nexa-live-empty">まだ相互マッチはありません。</div>`}`);
  };

  const renderNotifications = () => {
    show(`<div class="nexa-live-head"><span>SERVER NOTIFICATIONS</span><h3>通知</h3></div><div class="nexa-live-list">${state.notifications.length ? state.notifications.map((n) => `<article class="${n.readAt ? '' : 'unread'}"><div><b>${esc(n.kind)}</b><span>${esc(JSON.stringify(n.payload))}</span></div><button data-live-read="${esc(n.id)}">${n.readAt ? '既読' : '既読にする'}</button></article>`).join('') : '<div class="nexa-live-empty">通知はありません。</div>'}</div>`);
  };

  const renderMessages = () => {
    if (!state.activeMatch) {
      show(`<div class="nexa-live-empty"><h3>会話を選択</h3><p>マッチ一覧から相手を選択してください。</p></div>`);
      return;
    }
    show(`<div class="nexa-live-head"><span>SERVER MESSAGES</span><h3>${esc(displayName(state.activeMatch))}</h3></div><div class="nexa-live-chat"><div data-live-messages>${state.messages.map((m) => `<div class="${m.senderAccountId === state.accountId ? 'mine' : 'them'}">${esc(m.body)}</div>`).join('')}</div><form data-live-message-form><input name="body" placeholder="メッセージを入力…" required /><button class="nexa-live-primary">送信</button></form></div>`);
    content.querySelector('[data-live-message-form]')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!state.conversation) return;
      const form = event.currentTarget as HTMLFormElement;
      const body = String(new FormData(form).get('body') ?? '').trim();
      if (!body) return;
      await sendMessage(state.conversation.id, body);
      setState({ messages: (await listMessages(state.conversation.id)).messages });
    });
  };

  const openMatch = async (accountId: string) => {
    const match = state.matches.find((m) => m.accountId === accountId) ?? null;
    if (!match) return;
    const conversation = await createConversationFromMutualMatch(accountId);
    setState({ activeMatch: match, conversation, messages: (await listMessages(conversation.id)).messages });
    renderMessages();
  };

  renderDiscover();
  root.querySelectorAll('[data-live-view]').forEach((button) => button.addEventListener('click', () => {
    const view = (button as HTMLElement).dataset.liveView;
    if (view === 'discover') renderDiscover();
    if (view === 'matches') renderMatches();
    if (view === 'messages') renderMessages();
    if (view === 'notifications') renderNotifications();
  }));
  root.querySelector('[data-live-profile]')?.addEventListener('click', () => show(`<div class="nexa-live-head"><span>ACCOUNT</span><h3>プロフィール</h3></div><pre class="nexa-live-json">${esc(JSON.stringify(state.profile, null, 2))}</pre>`));
  root.querySelector('[data-live-refresh]')?.addEventListener('click', async () => { await refresh(); renderLiveShell(root, state, setState); });
  content.querySelector('[data-live-next]')?.addEventListener('click', () => { setState({ currentIndex: (state.currentIndex + 1) % Math.max(1, state.candidates.length) }); renderLiveShell(root, state, setState); });
  content.querySelector('[data-live-pass]')?.addEventListener('click', async () => { if (!candidate) return; await decideMatch({ targetAccountId: candidate.accountId, decision: 'pass', idempotencyKey: crypto.randomUUID() }); setState({ currentIndex: (state.currentIndex + 1) % Math.max(1, state.candidates.length) }); renderLiveShell(root, state, setState); });
  content.querySelector('[data-live-like]')?.addEventListener('click', async () => { if (!candidate) return; const result = await decideMatch({ targetAccountId: candidate.accountId, decision: 'like', idempotencyKey: crypto.randomUUID() }); await refresh(); if (result.mutual) { const conversation = await createConversationFromMutualMatch(candidate.accountId); setState({ activeMatch: candidate, conversation, messages: (await listMessages(conversation.id)).messages }); renderLiveShell(root, state, setState); } else { setState({ currentIndex: (state.currentIndex + 1) % Math.max(1, state.candidates.length) }); renderLiveShell(root, state, setState); } });
  content.querySelectorAll('[data-live-open-match]').forEach((button) => button.addEventListener('click', () => openMatch((button as HTMLElement).dataset.liveOpenMatch!)));
  content.querySelectorAll('[data-live-read]').forEach((button) => button.addEventListener('click', async () => { await markNotificationRead((button as HTMLElement).dataset.liveRead!); await refresh(); renderLiveShell(root, state, setState); }));
}

async function startLive(root: HTMLElement, profileRoot: HTMLElement) {
  let account = await getAuthenticatedAccount();
  let profile = await getMyProfile();
  const categories = (await listProfileCategories()).categories;
  if (!profile) {
    const category = categories[0];
    if (!category) throw new Error('利用可能なプロフィールカテゴリがありません。');
    const schema = category.fieldSchema ?? {};
    const fields: Record<string, string | number | boolean> = {};
    for (const [key, rule] of Object.entries(schema)) {
      if (rule.kind === 'boolean') fields[key] = false;
      else if (rule.kind === 'number') fields[key] = 0;
      else if (rule.required) fields[key] = key === 'name' || key === 'displayName' ? 'NEXA Demo User' : '';
    }
    if (!('name' in fields) && !('displayName' in fields)) fields.name = 'NEXA Demo User';
    profile = await createMyProfile({ categoryId: category.id, fields, geographicScope: { kind: 'country', countryCode: 'JP' } });
  }
  const discovery = await discoverProfiles({ categoryId: profile.categoryId, scope: 'global', limit: 20 });
  const [matches, notifications, history] = await Promise.all([listMatches(), listNotifications(), listMatchHistory()]);
  const state: LiveState = { accountId: account.id, profile, categories, candidates: discovery.items, matches: matches.items, notifications: notifications.notifications, history: history.items, currentIndex: 0, activeMatch: null, conversation: null, messages: [] };
  const setState = (patch: Partial<LiveState>) => Object.assign(state, patch);
  profileRoot.innerHTML = '';
  renderLiveShell(profileRoot, state, setState);
}

function install() {
  const shell = document.querySelector('.fullProductShell') as HTMLElement | null;
  if (!shell || document.getElementById('nexaLiveLaunch')) return;
  const button = document.createElement('button');
  button.id = 'nexaLiveLaunch';
  button.textContent = 'LIVE API';
  button.style.cssText = 'margin-left:12px;border:1px solid rgba(185,164,134,.45);background:rgba(185,164,134,.08);color:#d9c6a6;border-radius:999px;padding:7px 11px;font-size:9px;letter-spacing:.12em;cursor:pointer';
  const topbar = shell.querySelector('.fp-topbar');
  topbar?.appendChild(button);
  button.addEventListener('click', async () => {
    try {
      const account = await getAuthenticatedAccount();
      const target = shell.querySelector('.fp-content') as HTMLElement;
      await startLive(target, shell);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        formModal('実データで開始', 'ログインして実際のプロフィール、マッチ、会話、通知を読み込みます。', async (email, password) => {
          const result = await signIn(email, password);
          if (result.credential) sessionStorage.setItem('connect.credential', result.credential);
          const target = shell.querySelector('.fp-content') as HTMLElement;
          await startLive(target, shell);
        });
      } else {
        modalShell('ライブ接続を開始できません', error instanceof Error ? error.message : 'API接続に失敗しました。');
      }
    }
  });
  const registerButton = document.createElement('button');
  registerButton.textContent = '新規登録';
  registerButton.style.cssText = button.style.cssText + 'margin-left:6px';
  topbar?.appendChild(registerButton);
  registerButton.addEventListener('click', () => formModal('新規アカウント', '実際のAPIにアカウントを作成します。', async (email, password) => { await register(email, password); const result = await signIn(email, password); if (result.credential) sessionStorage.setItem('connect.credential', result.credential); const target = shell.querySelector('.fp-content') as HTMLElement; await startLive(target, shell); }));
}

const style = document.createElement('style');
style.textContent = `#nexaLiveModal{position:fixed;inset:0;z-index:10000;background:rgba(8,8,7,.74);backdrop-filter:blur(12px);display:grid;place-items:center;padding:20px}.nexa-live-modal-card{width:min(560px,100%);border:1px solid rgba(185,164,134,.25);border-radius:14px;background:linear-gradient(145deg,#1a1916,#0d0d0c);color:#f5f1e8;box-shadow:0 35px 100px rgba(0,0,0,.5);padding:26px}.nexa-live-modal-head{display:flex;justify-content:space-between;gap:18px}.nexa-live-modal-head span,.nexa-live-head span,.nexa-live-bar span{font-size:8px;letter-spacing:.2em;color:#b9a486}.nexa-live-modal-head h3,.nexa-live-head h3{font-size:25px;font-weight:400;margin:7px 0 0}.nexa-live-modal-head button{width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:transparent;color:#fff;font-size:20px}.nexa-live-modal-body{margin-top:22px}.nexa-live-modal-body form{display:grid;gap:12px}.nexa-live-modal-body label{display:grid;gap:7px;color:#aaa;font-size:10px}.nexa-live-modal-body input{background:#11110f;color:#fff;border:1px solid rgba(255,255,255,.12);padding:12px;border-radius:7px}.nexa-live-modal-body p{color:#d9a6a6;font-size:10px;min-height:16px}.nexa-live-primary{background:#b9a486!important;color:#111!important;border-color:#b9a486!important}.nexa-live-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.nexa-live-bar div{display:flex;align-items:center;gap:10px}.nexa-live-bar button,.nexa-live-nav button,.nexa-live-actions button,.nexa-live-list button{border:1px solid rgba(255,255,255,.12);background:transparent;color:#bbb;padding:9px 13px;font-size:9px;cursor:pointer}.nexa-live-bar strong{font-size:9px;font-weight:400;color:#ddd}.nexa-live-nav{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:20px}.nexa-live-nav button b{color:#b9a486;font-weight:400}.nexa-live-content{min-height:430px}.nexa-live-head{display:flex;align-items:end;justify-content:space-between;margin-bottom:18px}.nexa-live-head small{color:#777}.nexa-live-card{display:grid;grid-template-columns:130px 1fr;gap:22px;align-items:center;min-height:220px;padding:28px;border:1px solid rgba(255,255,255,.09);border-radius:8px;background:linear-gradient(135deg,#1c1c19,#10100f)}.nexa-live-avatar{width:120px;height:120px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 40% 30%,#96836b,#403a31 48%,#181714 75%);font-size:54px;color:#ddd0bf}.nexa-live-card h4{font-size:38px;font-weight:400;margin:8px 0}.nexa-live-card span,.nexa-live-card p{color:#888;font-size:10px}.nexa-live-actions{display:flex;justify-content:center;gap:8px;margin:18px 0}.nexa-live-status{font-size:8px;color:#666;text-align:center;border-top:1px solid rgba(255,255,255,.08);padding-top:13px}.nexa-live-list{display:grid;gap:8px}.nexa-live-list article{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02)}.nexa-live-list article div{display:grid;gap:5px}.nexa-live-list article span{font-size:8px;color:#777}.nexa-live-list article.unread{border-color:rgba(185,164,134,.28)}.nexa-live-empty{text-align:center;padding:70px 20px;color:#777}.nexa-live-empty h3{color:#ddd;font-weight:400}.nexa-live-chat{border:1px solid rgba(255,255,255,.08);min-height:390px;display:flex;flex-direction:column}.nexa-live-chat>div{padding:18px;display:grid;gap:8px;flex:1;align-content:start}.nexa-live-chat>div div{max-width:72%;padding:10px 13px;font-size:9px;background:#22211e;color:#bbb}.nexa-live-chat>div .mine{justify-self:end;background:#b9a486;color:#111}.nexa-live-chat form{display:flex;border-top:1px solid rgba(255,255,255,.08)}.nexa-live-chat input{flex:1;background:transparent;border:0;color:#fff;padding:14px;font-size:10px;outline:0}.nexa-live-chat button{border:0;padding:0 20px}.nexa-live-json{white-space:pre-wrap;max-height:400px;overflow:auto;color:#bbb;font-size:9px}@media(max-width:600px){.nexa-live-card{grid-template-columns:1fr;text-align:center}.nexa-live-avatar{margin:auto}.nexa-live-head{display:block}.nexa-live-head small{display:block;margin-top:6px}}`;
document.head.appendChild(style);

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
else install();
