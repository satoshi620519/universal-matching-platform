# Session Handoff — 2026-09-18

## Current verified state

- Repository: `satoshi620519/universal-matching-platform`
- Working branch: `feature/landing-authenticated-flow`
- Branch currently matches `main` at commit `4a09ba7f7d08e75b66c4cdffa0eef7608cebbe78`.
- Web entry point: `apps/web/index.html` loads `src/landing.tsx`.
- The landing experience contains the interactive product demo.
- Demo authentication includes an account sign-in form and a guest/demo sign-in path.
- Guest demo credential is local-only (`demo-session`) and must not be used for authenticated API requests.
- Render frontend deployment previously reported `live` for the guest-demo change.

## Required product flow

1. Public landing page is visible without authentication.
2. User opens the interactive demo.
3. User can enter through guest/demo sign-in without creating an account.
4. Authenticated/demo state exposes the internal product navigation and interactive functions.
5. Sign-out clears the local credential and returns the user to a public/unauthenticated state.
6. Existing design and internal demo behavior must remain intact.

## Next implementation order

1. Inspect the complete `landing.tsx` through safe segmented retrieval before editing.
2. Verify the actual rendered flow in a build/deployment environment.
3. Add or adjust explicit landing-to-demo and sign-out state transitions only where missing.
4. Run web typecheck/build/tests.
5. Deploy and verify the Render service before reporting completion.

## Safety constraints

- Do not replace `landing.tsx` with truncated content.
- Do not merge the old closed PR #55 blindly.
- Do not reuse `demo-session` for API calls.
- Record each code change, validation result, deployment ID, and next step in this file or a newer handoff file.
