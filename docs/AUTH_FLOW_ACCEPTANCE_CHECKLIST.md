# Authenticated Landing Flow — Acceptance Checklist

## Public entry

- [ ] Landing page renders without a credential.
- [ ] Primary demo CTA opens the interactive product demo.
- [ ] No global authentication controls are displayed in the public header.

## Demo access

- [ ] Demo login is available from the product demo authentication area.
- [ ] Guest/demo entry works without an account.
- [ ] Guest state is local-only and is never sent as an API bearer credential.
- [ ] Account sign-in remains available separately.

## Internal product experience

- [ ] Successful guest or account entry exposes the internal navigation.
- [ ] Discover, matches, messages, notifications, profile, safety, global, and settings views remain reachable.
- [ ] Existing interactive demo behavior is preserved.

## Sign-out

- [ ] Sign-out removes the locally stored credential.
- [ ] Sign-out returns the demo to an unauthenticated/public state.
- [ ] A guest credential cannot be used for authenticated API requests.

## Validation gates

- [ ] `npm run typecheck` passes in `apps/web`.
- [ ] `npm run build` passes in `apps/web`.
- [ ] `npm test` passes in `apps/web`.
- [ ] Render deployment reports `live`.
- [ ] Browser smoke test confirms the full public → demo login → internal app → sign-out path.
