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

function installStyles() {
  if (document.getElementById('nexaLiveStyles')) return;
  const style = document.createElement('style');
  style.id = 'nexaLiveStyles';
  style.textContent = `.nexa-live-root{margin:18px 0;border:1px solid rgba(185,164,134,.2);border-radius:22px;background:rgba(10,10,10,.72);overflow:hidden}.nexa-live-bar,.nexa-live-nav{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.07)}.nexa-live-bar{justify-content:space-between}.nexa-live-bar span,.nexa-live-head span{font-size:9px;letter-spacing:.16em;color:#b9a486}.nexa-live-bar strong{margin-left:8px;font-size:11px}.nexa-live-nav{overflow:auto}.nexa-live-nav button,.nexa-live-actions button,.nexa-live-list button,.nexa-live-bar button{border:1px solid rgba(185,164,134,.24);background:rgba(255,255,255,.035);color:inherit;border-radius:999px;padding:8px 13px;white-space:nowrap;cursor:pointer}.nexa-live-nav button:hover,.nexa-live-actions button:hover,.nexa-live-list button:hover,.nexa-live-bar button:hover{background:rgba(185,164,134,.1)}.nexa-live-content{padding:20px}.nexa-live-head h3{margin:7px 0 4px;font-size:24px}.nexa-live-head small{opacity:.55}.nexa-live-card{display:flex;align-items:center;gap:18px;margin:20px 0;padding:20px;border:1px solid rgba(185,164,134,.18);border-radius:18px;background:rgba(255,255,255,.025)}.nexa-live-avatar{width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#b9a486,#554b3d);color:#111;font-size:24px;font-weight:700}.nexa-live-card span,.nexa-live-list span{display:block;opacity:.55;font-size:12px}.nexa-live-card h4{margin:5px 0;font-size:21px}.nexa-live-card p{margin:0;opacity:.72}.nexa-live-actions{display:flex;gap:8px;flex-wrap:wrap}.nexa-live-primary{background:#b9a486!important;color:#111!important;border-color:#b9a486!important}.nexa-live-status{margin-top:14px;font-size:10px;opacity:.45;letter-spacing:.04em}.nexa-live-list{display:grid;gap:8px;margin-top:18px}.nexa-live-list article{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 16px;border:1px solid rgba(255,255,255,.07);border-radius:14px}.nexa-live-list article.unread{border-color:rgba(185,164,134,.3)}.nexa-live-empty{padding:28px;text-align:center;opacity:.7}.nexa-live-chat{margin-top:18px}.nexa-live-chat [data-live-messages]{display:grid;gap:8px;min-height:120px;margin-bottom:14px}.nexa-live-chat [data-live-messages] div{max-width:78%;padding:10px 13px;border-radius:14px;background:rgba(255,255,255,.07)}.nexa-live-chat [data-live-messages] .mine{margin-left:auto;background:rgba(185,164,134,.2)}.nexa-live-chat form{display:flex;gap:8px}.nexa-live-chat input,.nexa-live-modal-body input{flex:1;min-width:0;padding:11px 13px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(255,255,255,.04);color:inherit}.nexa-live-modal-card{width:min(520px,calc(100vw - 32px));border:1px solid rgba(185,164,134,.25);border-radius:20px;background:#151515;padding:20px;box-shadow:0 25px 80px rgba(0,0,0,.55)}.nexa-live-modal-head{display:flex;justify-content:space-between;align-items:flex-start}.nexa-live-modal-head span{font-size:9px;letter-spacing:.15em;color:#b9a486}.nexa-live-modal-head h3{margin:7px 0 18px}.nexa-live-modal-head button{border:0;background:none;color:inherit;font-size:24px;cursor:pointer}.nexa-live-modal-body form{display:grid;gap:12px}.nexa-live-modal-body label{display:grid;gap:6px;font-size:12px}.nexa-live-modal-body p{min-height:18px;color:#e0a0a0;font-size:12px}.nexa-live-modal-body button{border:0;border-radius:12px;padding:12px;cursor:pointer}.nexa-live-modal-body .nexa-live-primary{color:#111}`;
  document.head.appendChild(style);
}

function modalShell(title: string, body: string) {
  const existing = document.getElementById('nexaLiveModal');
  existing?.remove();
  const modal = document.createElement('div');
  modal.id = 'nexaLiveModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:rgba(0,0,0,.68);padding:16px';
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
    const data = new FormData(form);
    error.textContent = '';
    try {
      await onSubmit(String(data.get('email') ?? ''), String(data.get('password') ?? ''));
      modal.remove();
    } catch (err) {
      error.textContent = err instanceof Error ? err.message : '処理に失敗しました。';
    }
  });
  return modal;
}

async function refreshState(state: LiveState) {
  const [matches, notifications, history] = await Promise.all([listMatches(), listNotifications(), listMatchHistory()]);
  state.matches = matches.items;
  state.notifications = notifications.notifications;
  state.history = history.items;
}

function renderLiveShell(root: HTMLElement, state: LiveState) {
  const candidate = state.candidates[state.currentIndex] ?? null;
  root.innerHTML = `<div class="nexa-live-bar"><div><span>LIVE API</span><strong>${esc(state.accountId.slice(0, 8))}</strong></div><button data-live-refresh>更新</button></div><div class="nexa-live-nav"><button data-live-view="discover">探す</button><button data-live-view="matches">マッチ <b>${state.matches.length}</b></button><button data-live-view="messages">メッセージ</button><button data-live-view="notifications">通知 <b>${state.notifications.filter((n) => !n.readAt).length}</b></button><button data-live-profile>プロフィール</button></div><div class="nexa-live-content" data-live-content></div>`;
  const content = root.querySelector('[data-live-content]') as HTMLElement;
  const show = (html: string) => { content.innerHTML = html; };
  const rerender = () => renderLiveShell(root, state);

  const renderDiscover = () => {
    if (!candidate) { show(`<div class="nexa-live-empty"><h3>候補がありません</h3><p>プロフィールと地域設定を確認してから再読み込みしてください。</p></div>`); return; }
    show(`<div class="nexa-live-head"><span>AUTHORITATIVE DISCOVERY</span><h3>あなたに合う相手</h3><small>${state.currentIndex + 1} / ${state.candidates.length}</small></div><article class="nexa-live-card"><div class="nexa-live-avatar">${esc(displayName(candidate).slice(0,1).toUpperCase())}</div><div><span>${esc(roleText(candidate))} · ${esc(placeText(candidate))}</span><h4>${esc(displayName(candidate))}</h4><p>${esc(tagsText(candidate))}</p></div></article><div class="nexa-live-actions"><button data-live-pass>スキップ</button><button class="nexa-live-primary" data-live-like>♡ いいね</button><button data-live-next>次へ →</button></div><div class="nexa-live-status">API永続化 · 相互マッチ判定 · 安全ルール適用</div>`);
  };
  const renderMatches = () => show(`<div class="nexa-live-head"><span>PERSISTENT MATCHES</span><h3>マッチ一覧</h3><small>${state.matches.length} 件</small></div>${state.matches.length ? `<div class="nexa-live-list">${state.matches.map((m) => `<article><div><b>${esc(displayName(m))}</b><span>${esc(roleText(m))} · ${esc(placeText(m))}</span></div><button data-live-open-match="${esc(m.accountId)}">メッセージ</button></article>`).join('')}</div>` : `<div class="nexa-live-empty">まだ相互マッチはありません。</div>`}`);
  const renderNotifications = () => show(`<div class="nexa-live-head"><span>SERVER NOTIFICATIONS</span><h3>通知</h3></div><div class="nexa-live-list">${state.notifications.length ? state.notifications.map((n) => `<article class="${n.readAt ? '' : 'unread'}"><div><b>${esc(n.kind)}</b><span>${esc(JSON.stringify(n.payload))}</span></div><button data-live-read="${esc(n.id)}">${n.readAt ? '既読' : '既読にする'}</button></article>`).join('') : '<div class="nexa-live-empty">通知はありません。</div>'}</div>`);
  const renderMessages = () => {
    if (!state.activeMatch || !state.conversation) { show(`<div class="nexa-live-empty"><h3>会話を選択</h3><p>マッチ一覧から相手を選択してください。</p></div>`); return; }
    show(`<div class="nexa-live-head"><span>SERVER MESSAGES</span><h3>${esc(displayName(state.activeMatch))}</h3></div><div class="nexa-live-chat"><div data-live-messages>${state.messages.map((m) => `<div class="${m.senderAccountId === state.accountId ? 'mine' : 'them'}">${esc(m.body)}</div>`).join('')}</div><form data-live-message-form><input name="body" placeholder="メッセージを入力…" required /><button class="nexa-live-primary">送信</button></form></div>`);
    content.querySelector('[data-live-message-form]')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const body = String(new FormData(form).get('body') ?? '').trim();
      if (!body) return;
      await sendMessage(state.conversation!.id, body);
      state.messages = (await listMessages(state.conversation!.id)).messages;
      renderMessages();
    });
  };

  root.querySelectorAll('[data-live-view]').forEach((button) => button.addEventListener('click', () => {
    const view = (button as HTMLElement).dataset.liveView;
    if (view === 'discover') renderDiscover();
    if (view === 'matches') renderMatches();
    if (view === 'messages') renderMessages();
    if (view === 'notifications') renderNotifications();
  }));
  root.querySelector('[data-live-profile]')?.addEventListener('click', () => show(`<div class="nexa-live-head"><span>ACCOUNT</span><h3>プロフィール</h3></div><pre class="nexa-live-json">${esc(JSON.stringify(state.profile, null, 2))}</pre>`));
  root.querySelector('[data-live-refresh]')?.addEventListener('click', async () => { await refreshState(state); rerender(); });
  content.querySelector('[data-live-next]')?.addEventListener('click', () => { if (state.candidates.length) state.currentIndex = (state.currentIndex + 1) % state.candidates.length; rerender(); });
  content.querySelector('[data-live-pass]')?.addEventListener('click', async () => { if (!candidate) return; await decideMatch({ targetAccountId: candidate.accountId, decision: 'pass', idempotencyKey: crypto.randomUUID() }); if (state.candidates.length) state.currentIndex = (state.currentIndex + 1) % state.candidates.length; rerender(); });
  content.querySelector('[data-live-like]')?.addEventListener('click', async () => {
    if (!candidate) return;
    const result = await decideMatch({ targetAccountId: candidate.accountId, decision: 'like', idempotencyKey: crypto.randomUUID() });
    await refreshState(state);
    if (result.mutual) {
      state.activeMatch = candidate;
      state.conversation = await createConversationFromMutualMatch(candidate.accountId);
      state.messages = (await listMessages(state.conversation.id)).messages;
      renderMessages();
    } else {
      if (state.candidates.length) state.currentIndex = (state.currentIndex + 1) % state.candidates.length;
      rerender();
    }
  });
  content.querySelectorAll('[data-live-open-match]').forEach((button) => button.addEventListener('click', async () => {
    const accountId = (button as HTMLElement).dataset.liveOpenMatch!;
    const match = state.matches.find((m) => m.accountId === accountId);
    if (!match) return;
    state.activeMatch = match;
    state.conversation = await createConversationFromMutualMatch(accountId);
    state.messages = (await listMessages(state.conversation.id)).messages;
    renderMessages();
  }));
  content.querySelectorAll('[data-live-read]').forEach((button) => button.addEventListener('click', async () => { await markNotificationRead((button as HTMLElement).dataset.liveRead!); await refreshState(state); rerender(); }));
  renderDiscover();
}

async function startLive(root: HTMLElement) {
  const account = await getAuthenticatedAccount();
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
  root.classList.add('nexa-live-root');
  renderLiveShell(root, state);
}

function install() {
  installStyles();
  const shell = document.querySelector('.fullProductShell') as HTMLElement | null;
  if (!shell || document.getElementById('nexaLiveLaunch')) return;
  const topbar = shell.querySelector('.fp-topbar');
  const target = shell.querySelector('.fp-content') as HTMLElement | null;
  if (!target) return;
  let liveRoot = document.getElementById('nexaLiveRoot') as HTMLElement | null;
  if (!liveRoot) { liveRoot = document.createElement('section'); liveRoot.id = 'nexaLiveRoot'; target.appendChild(liveRoot); }
  const baseStyle = 'border:1px solid rgba(185,164,134,.45);background:rgba(185,164,134,.08);color:#d9c6a6;border-radius:999px;padding:7px 11px;font-size:9px;letter-spacing:.12em;cursor:pointer';
  const button = document.createElement('button'); button.id = 'nexaLiveLaunch'; button.textContent = 'LIVE API'; button.style.cssText = baseStyle; topbar?.appendChild(button);
  button.addEventListener('click', async () => {
    try {
      await getAuthenticatedAccount();
      await startLive(liveRoot!);
      liveRoot!.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        formModal('実データで開始', 'ログインして実際のプロフィール、マッチ、会話、通知を読み込みます。', async (email, password) => {
          const result = await signIn(email, password);
          if (!result.credential) throw new Error('ログイン認証情報を取得できませんでした。');
          sessionStorage.setItem('connect.credential', result.credential);
          await startLive(liveRoot!);
          liveRoot!.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      } else {
        modalShell('ライブ接続を開始できません', error instanceof Error ? error.message : 'API接続に失敗しました。');
      }
    }
  });
  const registerButton = document.createElement('button'); registerButton.textContent = '新規登録'; registerButton.style.cssText = baseStyle + 'margin-left:6px'; topbar?.appendChild(registerButton);
  registerButton.addEventListener('click', () => formModal('新規アカウント', 'アカウントを作成', async (email, password) => {
    await register(email, password);
    modalShell('登録を受け付けました', '<p>メール認証が必要な構成の場合は、認証完了後に「LIVE API」からログインしてください。</p>');
  }));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true }); else install();
