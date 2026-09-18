# Demo Authentication Integration — Direct GitHub Track

## Scope

Issue #54 requires authentication to be connected to the real matching demo UI without removing the existing guided tour, shortcuts, or matching flows.

## Current architecture confirmed

- `demo.html` is the outer login wrapper and currently calls the API authentication endpoints.
- `demo-v7.html` is the feature-check panel wrapper and embeds `demo-v6.html`.
- The matching experience is nested below the wrapper; therefore, changing only the outer login state is insufficient unless the state is propagated into the embedded matching UI.
- The existing authentication API must be reused; it must not be reimplemented.

## Safe implementation contract

1. Preserve the complete existing HTML source of every demo layer.
2. Add a small authentication bridge rather than rewriting the large one-line demo files manually.
3. Propagate authentication state from the outer wrapper to the embedded matching UI with an explicit, origin-checked `postMessage` contract.
4. Keep guided tour, shortcuts, matching, messaging, notifications, safety, regional settings, and admin/analytics navigation unchanged.
5. Cover unauthenticated, authenticated, and signed-out states with automated checks before calling the issue complete.
6. Record the exact commit SHA, verification commands, and deployed URL after validation.

## Direct GitHub track status

- Working branch: `feature/demo-auth-integration-direct`
- Main branch has not been changed by this track.
- No production/demo file has been overwritten by a partial or truncated HTML payload.
- Automated execution and Render deployment verification are not available through the direct file-edit operation alone; they remain explicitly unverified until an executable validation path is available.

## Next safe change

Use a complete-source transformation (not a manually reconstructed truncated HTML replacement) to add the bridge script and message handling to the nested demo layer, then run the repository's existing checks and a live Render verification. If complete-source editing or test execution cannot be performed safely, stop without changing the large HTML files and keep this status record current.
