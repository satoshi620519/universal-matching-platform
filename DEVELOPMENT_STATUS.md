# Development Status

CURRENT PHASE: Phase 3 — Implementation
CURRENT MILESTONE: Milestone 1 — Core API, database and identity
CURRENT TASK: Inspect the next identity workflow after CI-validating authenticated account lookup.
STATUS: Authenticated account lookup slice is CI validated; next slice must remain grounded in existing contracts.

## Continuation protocol — READ FIRST
GitHub main is the persistent source of truth. Before every new work session:
1. Read this file.
2. Verify the files, commits and CI run named in the latest checkpoint.
3. Do not assume an unverified change passed CI.
4. Resume from the Exact next action section.
5. After every coherent implementation slice, update this file with files changed, commit SHA, CI state, unresolved constraints and the exact next action.

Never overwrite a working boundary based on conversational memory. Prefer repository state and CI evidence.

## Latest checkpoint — 2026-08-31

### CI-validated authenticated capability slice
- RequestPrincipalResolver exists and resolves an authenticated RequestPrincipal through RequestAuthenticationAdapter.
- Missing authentication is rejected with UnauthorizedException.
- GET /capabilities/access/authenticated exists alongside the legacy route.
- Legacy GET /capabilities/access remains backward-compatible.
- Authenticated capability evaluation uses RequestPrincipal.verificationLevel as the server-side verification input.
- The authenticated query contract does not contain currentVerificationLevel.
- Controller tests cover principal-derived authorization, unauthenticated rejection and malformed principal verification levels.
- Test commit: 6dde068d02f5184689d45bd283cb9bf9f3c07523.
- Checkpoint commit: fa79dd6dcb6a4aeddd4b706c023536185aca3d4b.
- GitHub Actions CI run #317 for fa79dd6d completed successfully.
- The latest follow-up CI run #318 is for documentation commit ff371c17310c6a99a6e565f6553fc51cf70f4b15 and was in progress at last observation; it is not required to establish the code slice because #317 already succeeded.

### CI-validated authenticated account lookup slice
- GET /accounts/authenticated resolves the account from RequestPrincipal.accountId.
- No client-supplied accountId is accepted by the authenticated route.
- Missing authentication is rejected with UnauthorizedException.
- Missing authenticated account is rejected with NotFoundException.
- Legacy GET /accounts/:accountId remains unchanged.
- Focused controller tests cover principal-derived lookup, unauthenticated rejection and missing account handling.
- Implementation commits: ff18c005446c327cb9c31d1368fe8042652d649e and 8c840dc4e3c4d56c60e05c1b0b3718c62f640673.
- GitHub Actions CI run #322 for 8c840dc4e3c4d56c60e05c1b0b3718c62f640673 completed successfully (install, typecheck, lint, test, build).

### Verified baseline
- Account Lookup HTTP boundary: CI validated.
- Account Activation HTTP/application boundary: CI validated.
- Authentication/request-principal contracts: CI validated.
- Verification Access HTTP/application boundary: CI validated.
- Capability Access HTTP/application boundary and runtime input validation: CI validated.
- Capability validation CI #309 passed: install, typecheck, lint, test and build all green.

### Architecture constraints
- RequestPrincipal defines accountId, authenticationMethod and optional verificationLevel.
- AnonymousAuthenticationAdapter currently returns undefined.
- No token format, JWT parser, session store or external identity-provider contract is currently grounded in the repository.
- Do not replace the legacy capability route with mandatory authentication until a real authentication adapter exists.
- Do not invent identity transport or persistence contracts.

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
- Request principal resolver boundary.
- Authenticated capability access boundary.
- Safety, moderation and audit domain foundations.
- Analytics, accessibility, operational quality, data lifecycle and deployment requirement foundations.

## Exact next action
1. Inspect existing verification and account application services for the next authenticated workflow that can reuse RequestPrincipal.accountId without inventing a token/session contract.
2. Prefer a read-only or narrowly scoped workflow before adding mutation semantics.
3. Keep legacy routes unchanged and preserve existing repository contracts.
4. Add focused tests for principal-derived identity and failure boundaries.
5. Run full CI.
6. Record commit SHA, CI run number/conclusion and the following exact action here before moving on.