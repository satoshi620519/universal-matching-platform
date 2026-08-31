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

### CI-validated HTTP authentication principal validation
- HttpAuthenticationGuard now validates pre-attached and adapter-returned principals through the shared authenticated-principal contract before allowing the request.
- Invalid or incomplete principals fail with 401 instead of being treated as authenticated merely because a principal object exists.
- Focused tests cover invalid adapter-returned principals and invalid pre-attached principals.
- Implementation commits: 6b37cf24ebb8bffd7610cbbf8109a916a9ef7a73, e4dec00822393433a2b2c4788972069b4d1e34b7, df3b386caf4eb098fd8f26a8f07e3f730265c21e, 1aa787294031d220e495c1b219d3d6e224348bd5.
- GitHub Actions CI run #373 for 1aa787294031d220e495c1b219d3d6e224348bd5 completed successfully (install, typecheck, lint, test, build).

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

## Exact next action
1. Review remaining authenticated HTTP boundaries for inconsistent classification of malformed authentication/principal state versus malformed client input.
2. Keep 401 for absent or invalid authentication state, 403 for valid authenticated principals denied by authorization, and 400 for malformed route/query/body input.
3. Do not introduce a global guard migration unless an existing route composition gap requires it.
4. Add focused tests only where a concrete inconsistency is found.
5. Run full CI and record the checkpoint before advancing to another domain slice.

## Architecture constraints
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
