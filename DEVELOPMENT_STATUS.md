# Development Status

CURRENT PHASE: Phase 3 — Implementation
CURRENT MILESTONE: Milestone 1 — Core API, database and identity
CURRENT TASK: Build the authenticated Principal → Capability workflow without breaking the existing anonymous capability evaluation path.
STATUS: In progress. A request-principal resolver boundary has been added; the next step is to verify it in GitHub and design an explicit authenticated HTTP route before changing the legacy route.

## Continuation protocol — READ FIRST
GitHub main is the persistent source of truth. Before every new work session:
1. Read this file.
2. Verify the files and commits named in the latest checkpoint.
3. Do not assume an unverified change passed CI.
4. Resume from the exact next action below.
5. After every coherent implementation slice, update this file with: files changed, commit SHA, test/CI state, and the exact next action.

Never overwrite a working boundary based on an earlier conversational summary. Prefer repository state and CI evidence.

## Latest checkpoint — 2026-08-31

### Verified baseline
- Account Lookup HTTP boundary: CI validated.
- Account Activation HTTP/application boundary: CI validated.
- Authentication/request-principal contracts: existing baseline CI validated.
- Verification Access HTTP/application boundary: CI validated.
- Capability Access HTTP/application boundary and runtime input validation: CI validated.
- Capability validation CI #309 passed: install, typecheck, lint, test and build all green.

### Latest implementation attempt — NOT YET VERIFIED
The following slice was added immediately before this checkpoint and must be verified before building on it:
- New file: apps/api/src/auth/request-principal-resolver.ts
- New file: apps/api/src/auth/request-principal-resolver.test.ts
- Modified: apps/api/src/app.module.ts
- Intent: resolve an authenticated RequestPrincipal through RequestAuthenticationAdapter and return 401 when authentication is absent.
- Important: GitHub code search had not yet indexed the new resolver when checked. Do not assume the change is absent or failed; inspect main directly.
- CI status for this resolver slice: NOT YET VERIFIED.


### Authenticated capability slice — IN PROGRESS
- Verified on main: RequestPrincipalResolver and its unit test exist and AppModule registers the resolver.
- Added authenticated route: GET /capabilities/access/authenticated.
- Legacy GET /capabilities/access remains unchanged for backward compatibility.
- Authenticated route obtains verificationLevel only from RequestPrincipal and does not expose currentVerificationLevel as an authenticated query field.
- Missing principal maps to UnauthorizedException (401 boundary).
- Malformed or missing principal verificationLevel maps to BadRequestException.
- Updated capability controller tests to cover principal-derived authorization and unauthenticated rejection.
- Latest test commit: 6dde068d02f5184689d45bd283cb9bf9f3c07523.
- CI status: NOT YET VERIFIED.
- NOTE: controller implementation was already present on main before the test update; inspect its exact commit history before attributing ownership or CI status.

### Architecture constraint discovered
- apps/api/src/auth/request-principal.ts defines RequestPrincipal with accountId, authenticationMethod and optional verificationLevel.
- apps/api/src/auth/anonymous-authentication.adapter.ts currently returns undefined for every authentication attempt.
- apps/api/src/capabilities/capability-access.controller.ts currently accepts currentVerificationLevel from the client query.
- Therefore replacing the existing capability endpoint with mandatory principal authentication immediately would turn the currently usable anonymous endpoint into universal 401 responses.
- The safe next vertical slice is an explicit authenticated capability route/context, introduced alongside the existing legacy route, followed by migration only when a real authentication adapter exists.

## Current work item
Authenticated Principal → Capability workflow

Target sequence:
1. Verify the request-principal resolver files and AppModule registration on main.
2. Verify resolver unit tests and CI.
3. Keep GET /capabilities/access backward-compatible for now.
4. Introduce a separate explicit authenticated capability evaluation boundary only if an HTTP request-to-principal transport contract can be grounded in existing code.
5. Use RequestPrincipal.verificationLevel as server-side input; never let the authenticated route accept currentVerificationLevel from the client.
6. Return 401 for missing principal on the authenticated route.
7. Do not invent a token format, JWT parser, session store, or identity provider.
8. Run full CI and record the resulting run/commit before marking the slice complete.

## Completed — DO NOT RECREATE
- Project foundation and continuity rules.
- GitHub as persistent source of truth.
- Milestone 0 engineering foundation and CI baseline.
- Canonical domain primitives and tests.
- API application boundary.
- Database configuration/migration boundary.
- Capability gate and tests.
- Account lifecycle, activation, lookup and tests.
- Entitlement lifecycle and tests.
- Verification lifecycle and verification access boundary.
- Capability access service/boundary and validation.
- Safety, moderation and audit domain foundations.
- Analytics, accessibility, operational quality, data lifecycle and deployment requirement foundations.

## Exact next action
1. Fetch the current authenticated capability controller and tests from main.
2. Verify the controller/test constructor contracts compile together with RequestPrincipalResolver.
3. Inspect the commit/workflow status for the authenticated capability slice, including test commit 6dde068d02f5184689d45bd283cb9bf9f3c07523.
4. Do not mark the slice complete until CI is green.
5. If CI fails, fix only the reported boundary mismatch, then update this checkpoint with the new commit.
6. If CI passes, record the run and select the next slice.

## Previous continuation instruction (superseded by latest checkpoint)
Fetch these exact files from main and verify their contents before editing anything:
1. apps/api/src/auth/request-principal-resolver.ts
2. apps/api/src/auth/request-principal-resolver.test.ts
3. apps/api/src/app.module.ts
4. apps/api/src/auth/request-principal.ts
5. apps/api/src/auth/anonymous-authentication.adapter.ts

Then:
- If the resolver slice exists, verify its tests/CI and continue from step 3 of the Current work item.
- If it does not exist, recreate only that small resolver slice and record the resulting commit.
- Do not modify the legacy GET /capabilities/access route until the authenticated route contract is explicit and tested.
