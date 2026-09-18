# Auth Gate Implementation Task

## Objective
Implement the requested flow without changing the existing visual design or internal demo behavior:

- Public landing remains accessible without authentication.
- The interactive demo can be opened publicly.
- Before login, internal demo panels must show an authentication gate instead of exposing interactive internal functions.
- The gate must open the existing login modal.
- Both `デモとしてログイン` and real account login unlock the internal navigation.
- Logout must clear the credential and return the demo to the unauthenticated gate.

## Exact implementation target
In `apps/web/src/landing.tsx`, inside `FullProductDemo`, update the `panel` function immediately after its opening brace:

```tsx
if(!credential)return <div className="fp-page fp-authRequired"><div className="fp-toolbar"><div><span className="fp-kicker">ACCOUNT ACCESS</span><h3>ログインして機能を体験</h3></div><span>ロック中</span></div><div className="fp-empty"><b>内部機能はログイン後に利用できます</b><p>アカウント登録なしのデモログインでも、すべての機能を体験できます。</p><button onClick={()=>{setAuthError('');setAuthOpen(true)}}>ログイン / デモを開始</button></div></div>;
```

Keep the existing `view` branches unchanged. Do not use `demo-session` for API calls. Keep the current account login and guest login modal unchanged.

## Validation
Run in `apps/web`:

- `npm run typecheck`
- `npm run build`
- `npm test`

Then deploy the branch through the existing Render frontend service and confirm the deployment is live. Do not report completion until validation is confirmed.
