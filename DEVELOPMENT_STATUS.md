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

### CI-validated authenticated capability authentication semantics
- Malformed or missing verificationLevel claims on an authenticated principal are classified as authentication failures (401), not client request validation failures (400).
- Capability requirement failures for a valid authenticated principal remain authorization failures (403).
- Service and HTTP-boundary tests now share the same 401 classification for malformed principal claims.
- Implementation commits: 916c11a41f170d1fafc8a5ee9ad227ae8b58f4df, 0d805114bd3c231107e7fa213a7369292b313b9e, dd369ae49ee1d8a6aa52ffa8bf84600e579d6e55, 230f72e39490f7a9f908dce990a7b85c5616b3ea, c7bd723eb16fa18e88fbdc79cf32c0de940b7fe7, 401e2116a728e42425d8c30010d92c434de0ddc6.
- GitHub Actions CI run #368 for 401e2116a728e42425d8c30010d92c434de0ddc6 completed successfully (install, typecheck, lint, test, build).

### CI-validated capability authorization authentication boundary
- CapabilityAuthorizationGuard now requires an authenticated RequestPrincipal instead of treating an absent principal as verification level 0.
- Missing principals and invalid principal verification levels fail with 401 before capability evaluation.
- Authenticated principals that fail capability requirements continue to receive 403.
- Focused tests cover allow, missing-principal rejection, invalid-verification rejection and capability denial.
- Implementation commits: 359c970facddbed121e7154669f3e3be19449116, 0ad0a87d2197cf147e386a0c95222119e1fabc52.
- GitHub Actions CI run #361 for 0ad0a87d2197cf147e386a0c95222119e1fabc52 completed successfully (install, typecheck, lint, test, build).

### CI-validated durable legacy account activation
- PATCH /accounts/:accountId/activation now persists the successful domain transition through AccountRepository.updateStatus.
- Legacy and authenticated activation routes no longer differ in durability semantics.
- The controller rejects both an initially missing account and an account that disappears before persistence completes.
- Focused tests cover successful persistence and both missing-account boundaries.
- Implementation commits: 76c1bcfb395824472222699f537ebda6eb76bb35, 3e87462560d281045dc812b40fd8ada72c934317, 8532b59382f22b9f5406e9ff3615d2c0a4034d61, 90035ddc81c36b8f65324e35a0e8ed87db213f7c, dd26cb00837f8c6a63e6ba220893f218e152d119.
- GitHub Actions CI run #358 for dd26cb00837f8c6a63e6ba220893f218e152d119 completed successfully (install, typecheck, lint, test, build).

### CI-validated unified authenticated account context boundaries
- GET /accounts/authenticated now resolves its account exclusively through AuthenticatedAccountContextService.
- Authenticated lookup, activation and capability access share the same persisted-account boundary.
- RequestPrincipal remains the sole source of the authenticated account identity.
- Focused HTTP tests cover principal-derived targeting, unauthenticated rejection and missing-account propagation.
- Implementation commits: 565bdc049f6ff9aff17f1adee85c897bf9f28712, 56c41481b4faf53bbcc24d4a60e00510ccedca15.
- GitHub Actions CI run #352 for 56c41481b4faf53bbcc24d4a60e00510ccedca15 completed successfully (install, typecheck, lint, test, build).

### CI-validated authenticated capability access with account context
- GET /capabilities/access/authenticated now resolves the persisted authenticated account before capability evaluation.
- AuthenticatedCapabilityAccessService derives identity from RequestPrincipal and delegates capability semantics to the existing CapabilityAccessService.
- The authenticated principal verificationLevel is authoritative and cannot be overridden by request requirements.
- Missing authenticated accounts fail before capability evaluation.
- Focused tests cover account-context enforcement, missing-account propagation and missing verification-level rejection.
- Implementation commits: 6df5cb749536aa91ca3d7f07214ea2b6bf438d7d, b63846d10894575e1b883b617c0b39fbdc13b75d, fb4ca8ceee969822086e4d1e577c2939c20e7e1f, 4b7d921, 1fe23ed, 8f4cd6a, d0aa6677264357da33fb74108c211f5fb858167c, d640f39acb982f5e8552ab0efa79cb55f26d82c4.
- GitHub Actions CI run #349 for d640f39acb982f5e8552ab0efa79cb55f26d82c4 completed successfully (install, typecheck, lint, test, build).

### CI-validated durable authenticated account activation
- AuthenticatedAccountActivationService performs the existing domain transition and persists the resulting state through AccountRepository.updateStatus.
- PrismaAccountRepository implements updateStatus without introducing a separate persistence API.
- The authenticated target remains exclusively derived from RequestPrincipal.accountId.
- A missing account at the persistence boundary is rejected explicitly with NotFoundException.
- Focused tests cover principal-derived targeting, durable status update and disappearance before persistence.
- Implementation commits: bc645b8, 5c7da83, efbe6f6, 256de333a9d8502a4849de2ff073d3fd97c6c94f, f94497e6a3f9aa3315c3985eedf87b20ea609d9d.
- GitHub Actions CI run #340 for f94497e6a3f9aa3315c3985eedf87b20ea609d9d completed successfully (install, typecheck, lint, test, build).

### CI-validated authenticated account activation endpoint
- PATCH /accounts/authenticated/activation derives the target exclusively from the authenticated RequestPrincipal.
- RequestPrincipalResolver remains the HTTP authentication boundary.
- AuthenticatedAccountActivationService reuses the authenticated context and existing AccountActivationService semantics.
- No client-supplied accountId is accepted by the authenticated route.
- Legacy PATCH /accounts/:accountId/activation remains unchanged.
- Focused HTTP-boundary tests cover principal-derived activation and unauthenticated rejection.
- Implementation commits: 1ac6aa3ff0cd68326e66bbe5c1ba171cf2a1d5b1, dcb5550818b5f891612c350eef6c3322da227472, b29f90e26986bd5bb854267161f2c449b3d46450.
- GitHub Actions CI run #334 for b29f90e26986bd5bb854267161f2c449b3d46450 completed successfully (install, typecheck, lint, test, build).

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
1. Review remaining authenticated HTTP boundaries for inconsistent classification of malformed authentication/principal state versus malformed client input.
2. Keep 401 for absent or invalid authentication state, 403 for valid authenticated principals denied by authorization, and 400 for malformed route/query/body input.
3. Do not introduce a global guard migration unless an existing route composition gap requires it.
4. Add focused tests only where a concrete inconsistency is found.
5. Run full CI and record the checkpoint before advancing to another domain slice.
