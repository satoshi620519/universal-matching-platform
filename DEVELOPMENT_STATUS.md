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

### CI-validated principal-derived account activation slice
- AuthenticatedAccountActivationService derives the target exclusively from RequestPrincipal.accountId.
- AuthenticatedAccountContextService resolves the persisted account before lifecycle logic runs.
- Existing AccountActivationService and domain transition rules remain the single source of activation semantics.
- No client-supplied accountId is introduced for the authenticated workflow.
- Focused tests prove principal-derived targeting.
- Implementation commits: d0614a00a95f9be90d630ea63871cd1403485843, e4b00e5b5485168d723edb6ff4387915ad82d0ea, 6e9f5b8faf3f71f6830a861205048048c5d346e7.
- GitHub Actions CI run #330 for 6e9f5b8faf3f71f6830a861205048048c5d346e7 completed successfully (install, typecheck, lint, test, build).

### CI-validated authenticated account context slice
- AuthenticatedAccountContextService resolves AccountRepository data exclusively from RequestPrincipal.accountId.
- Context combines authenticated principal identity with persisted account state for reuse by future account-scoped workflows.
- Missing persisted account is rejected with NotFoundException.
- Focused service tests cover successful context construction and missing-account rejection.
- Registered in AppModule.
- Implementation commits: 214f5c162e773d82b87dd67523093ddc4b60a47d, 44653aa420ecfcce1552846267ec2dfd31204cb0, f087a844541802165f337d91a8a5c58d6c9fc349.
- GitHub Actions CI run #326 for f087a844541802165f337d91a8a5c58d6c9fc349 completed successfully (install, typecheck, lint, test, build).

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
1. Inspect the existing account HTTP lifecycle boundary and determine whether the principal-derived activation service can be exposed as a narrowly scoped authenticated endpoint without duplicating or weakening existing activation semantics.
2. Reuse RequestPrincipalResolver and AuthenticatedAccountActivationService; never accept accountId from the client for the authenticated route.
3. Preserve the legacy account activation route unchanged.
4. Add focused HTTP-boundary tests for principal-derived targeting and authentication failures.
5. Run full CI.
6. Record commit SHA, CI run number/conclusion and the following exact action here before moving on.
