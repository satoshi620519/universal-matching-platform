# Authentication Integration — Direct GitHub Handoff

## Scope
Integrate the existing demo authentication flow into the actual matching UI without changing the existing visual design, guided tour, shortcuts, or matching interactions.

## Current verified structure
- `apps/web/public/demo.html`: outer authentication shell; uses `POST /auth/sign-in` and `POST /auth/sign-out`.
- Session storage key: `nexa.session.credential`.
- `demo.html` embeds `demo-v7.html`.
- `demo-v7.html` embeds the matching experience through an iframe and exposes navigation/actions through the nested demo window.

## Safety constraints
1. Do not replace large HTML files with truncated content.
2. Preserve existing demo navigation and safety actions.
3. Do not create a second authentication API or change the API contract.
4. Authentication state must be propagated to the actual matching UI, not only displayed by the outer shell.
5. Verify unauthenticated, authenticated, and signed-out states before calling the task complete.

## Current status
- Working branch: `feature/demo-auth-integration-direct`
- No change has been made to `main`.
- The outer login shell exists, but full authentication integration into the nested matching UI is not yet verified.
- Automated and live Render verification remain pending because direct GitHub file operations do not execute the application test suite.

## Next safe implementation step
Inspect the complete `demo-v6.html` / nested frame contract and add a minimal, backward-compatible authentication state bridge. The bridge must fail closed for protected actions while leaving the existing guided tour and navigation intact.
