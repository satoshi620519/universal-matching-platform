# Issue #54 — Demo v7 authentication integration

## Scope

Issue #54 integrates the existing authentication API into the actual matching-demo wrapper at `apps/web/public/demo-v7.html`. It does not change the backend authentication, account, or session implementation.

## Current implementation

- Commit `1d0243f6c77234b3adbc369b3416e4d2abf64e1f` adds a matching-demo-local account panel, sign-in dialog, authenticated state indicator, and sign-out action.
- Commit `b87ff2e160e400c9bfb8ac1cb433c6da76036a53` preserves demo controls through the nested v6/v5 iframe boundary.
- Commit `8c5796b9c9d662d7f58d6a060687fefe95094c5f` adds automated source-contract coverage for unauthenticated, authenticated, and logout paths.

The demo uses the existing API endpoint `https://universal-matching-platform-api.onrender.com`:

- `POST /auth/sign-in` receives the email and password only for the request, and accepts a returned `credential`.
- The returned credential is held in browser `sessionStorage` under `nexa.session.credential`; it is not written to source or persistent browser storage.
- `POST /auth/sign-out` receives the current credential as a Bearer token. The browser removes the sessionStorage item in a `finally` block even if the network request fails.

## Verification performed

- Current source blob was read before every update; no large HTML file was replaced from truncated content.
- The deployed `/demo-v7.html` page displayed the new unauthenticated account panel and opened the sign-in dialog.
- Existing matching UI remained present after the change.
- A full successful sign-in request was not performed because no account credentials were supplied to this task. This remains the only unverified browser state; the automated contract covers its expected credential-handling transition.

## Next action

Run the repository test suite and, with a non-production test account supplied by the owner, verify successful sign-in followed by sign-out on the deployed demo. Record the resulting CI run, deployment identifier, and browser result on Issue #54.
