# Development Status

CURRENT PHASE: Phase 3 — Implementation
CURRENT MILESTONE: Milestone 1 — Core API, database and identity
CURRENT TASK: Validate the authenticated capability decision adapter using authoritative account state and explicit safety restriction input.
STATUS: Migration execution and HTTP application integration gates are validated against real CI infrastructure. CI #426 is fully green.

## Continuation protocol — READ FIRST
GitHub main is the persistent source of truth. Before every new work session:
1. Read this file.
2. Verify the files, commits and CI run named in the latest checkpoint.
3. Do not assume an unverified change passed CI.
4. Resume from the Exact next action section.
5. After every coherent implementation slice, update this file with files changed, commit SHA, CI state, unresolved constraints and the exact next action.

Never overwrite a working boundary based on conversational memory. Prefer repository state and CI evidence.

## Latest checkpoint — 2026-08-31

### HTTP application integration gate — COMPLETE
- Added real Fastify/Nest HTTP integration coverage for `GET /health` with both caller-provided and generated correlation IDs.
- Investigated repeated CI HTTP 500 responses using server-side exception logging rather than speculative production changes.
- Root cause was confirmed from CI: `HealthStatusService` was undefined in `HealthController` during the real HTTP path.
- Fixed the Nest ESM/DI boundary by explicitly injecting `HealthStatusService` with `@Inject(HealthStatusService)`.
- Extracted `configureHttpApplication()` into `apps/api/src/http-application.ts` so production bootstrap and integration tests share the same HTTP filters/hooks without importing the side-effecting entrypoint.
- CI #426 completed successfully: PostgreSQL service healthy, typecheck, lint, all tests including HTTP integration, and build passed.
- Final validated DI fix commit: `4b81f338c5dcfc39fe974d8f089560ad269920ff`.

### Account migration execution gate — COMPLETE
- `packages/database/migrations/0001_create_accounts.sql` remains grounded exclusively in the physical Prisma Account schema.
- Added migration planning/execution boundaries and tests in `packages/database/src/migrations.ts`, `packages/database/src/executor.ts`, and their tests.
- Added the API migration runner and Prisma transaction adapter.
- Added PostgreSQL integration coverage for migration apply + idempotent rerun and failed-migration rollback.
- CI provisions PostgreSQL 16 and passes `DATABASE_URL` through Turbo test tasks.
- Final rollback-test commit: `32f519d7419855802b73320ba52161b04d74e64a`.
- CI #413 completed successfully.

## Authentication/identity boundary planning — COMPLETE
- Traced the next M1 gap to PRODUCT_REQUIREMENTS.md, ARCHITECTURE.md and the technology baseline in DECISIONS.md.
- Confirmed email/password, verification and reset are required initial capabilities, while provider protocol, password algorithm and session/token transport remain unresolved.
- Added IDENTITY_AUTHENTICATION_BOUNDARY.md to prevent credentials from being mixed into Account or API transport prematurely.
- No production behavior changed in this planning slice.

## Authentication identity persistence planning — COMPLETE
- Traced DATA_MODEL_DRAFT.md AuthenticationIdentity ownership into the existing physical Account schema and migration conventions.
- Defined AUTHENTICATION_CREDENTIAL_PERSISTENCE_PLAN.md with the smallest additive authentication_identities model.
- Account remains free of authentication secrets.
- Password hashes, JWT/session state, provider payloads, verification evidence and recovery secrets remain explicitly out of this migration.

## Authentication identity persistence — COMPLETE
- Added packages/database/migrations/0002_create_authentication_identities.sql.
- Added exact Prisma AuthenticationIdentity mapping and Account relation.
- Added PostgreSQL migration integration coverage for versions 1 and 2, idempotent reruns and failed migration rollback boundaries.
- CI #434 completed successfully: PostgreSQL service, typecheck, lint, all tests and build passed.
- Persistence model contains identity linkage only; credential secrets and transport tokens remain excluded.

## Authentication identity repository boundary — COMPLETE
- Added provider-neutral AuthenticationIdentityRepository contract.
- Added PrismaAuthenticationIdentityRepository implementation.
- Added create, provider identity lookup and status update operations.
- Registered the repository through Nest DI.
- CI #439 completed successfully: PostgreSQL service, typecheck, lint, all tests and build passed.
- No credential secret, token or provider protocol was introduced.

## Authentication identity lifecycle service — COMPLETE
- Added AuthenticationIdentityService above the repository boundary.
- Centralized active identity creation, active-only provider lookup and deactivation behavior.
- Added focused unit tests.
- Registered the service in Nest DI.
- CI #442 and CI #443 passed typecheck, lint, all tests and build.
- No password verification, credential secret, token/session transport or provider protocol was introduced.

## Authentication identity and verification boundary — COMPLETE
- Inspected the existing outcome-only VerificationRecord domain and verification access boundary.
- Confirmed verification lifecycle is independent from AuthenticationIdentity lifecycle.
- Added AUTHENTICATION_IDENTITY_VERIFICATION_BOUNDARY.md.
- Explicitly prevented verification evidence or level/status fields from being copied into authentication_identities.
- Deferred association-key design until verification persistence ownership is explicitly implemented.

## Verification persistence planning — COMPLETE
- Traced VerificationRecord outcome semantics into DATA_MODEL_DRAFT.md verification_requests and verification_outcomes ownership.
- Added VERIFICATION_PERSISTENCE_PLAN.md.
- Preserved separation from AuthenticationIdentity.
- Explicitly excluded raw provider responses, documents, biometrics and secrets from ordinary persistence.

## Verification persistence — COMPLETE
- Added migration 0003 for verification_requests and verification_outcomes.
- Added exact Prisma mappings and Account ownership relation.
- Extended PostgreSQL migration integration coverage.
- Corrected atomic migration fixture assumptions and rollback setup expectations.
- CI #454 passed typecheck, lint, all tests and build.
- Raw provider evidence, documents, biometrics and secrets remain outside ordinary persistence.

## Verification repository boundary — COMPLETE
- Added provider-neutral VerificationRepository contract.
- Added PrismaVerificationRepository implementation.
- Added request creation and latest account outcome lookup operations.
- Registered repository through Nest DI.
- CI #460 and #461 completed successfully with typecheck, lint, tests and build green.
- Provider evidence and provider SDK types remain outside the repository contract.

## Verification lifecycle service — COMPLETE
- Added VerificationService above the provider-neutral repository.
- Centralized pending request initiation.
- Reconstructed VerificationRecord and reused existing domain usability rules.
- Added focused unit tests for usable and expired outcomes.
- Registered service in Nest DI.
- CI #464 and #465 passed typecheck, lint, tests and build.

## Authentication and verification integration boundary — COMPLETE
- Confirmed authentication establishes an account principal and remains independent from verification outcomes.
- Defined protected capability checks as the integration seam for verification requirements.
- Added AUTHENTICATION_VERIFICATION_INTEGRATION_BOUNDARY.md.
- Explicitly deferred JWT/session, password credentials, provider callbacks and global capability policy engine decisions.

## Verification capability access — COMPLETE
- Added VerificationLevelAccessService for provider-neutral required-level comparison.
- Added VerificationCapabilityAccessService to compose account outcome lookup and level evaluation.
- Kept authentication transport, persistence details and provider SDK types outside access decisions.
- Added focused tests for sufficient verification and missing usable verification.
- Registered composition through Nest DI.
- CI #472 and #473 completed successfully with typecheck, lint, tests and build green.

## Capability decision contract — IMPLEMENTED, CI PENDING
- CI #475 passed the initial CapabilityDecision contract.
- Reused existing blocksCapability(), AccountState, VerificationLevel and canUseCapability() primitives.
- Added decideCapability() with deterministic denial precedence:
  1. safety restriction
  2. non-active account
  3. insufficient verification
  4. entitlement state/timing
  5. allowed
- Added focused precedence tests, including multiple simultaneous denials and entitlement timing.
- Latest implementation commits: 4c1bc36c96e45d3011887767df2a5b0621a703d0, a4ef52ca8c570f4cdeec341f0a3d308c47c6ba06.
- Awaiting CI before completion.

## Capability decision domain boundary — COMPLETE
- Added deterministic decideCapability() precedence using existing domain primitives.
- CI #481 and #482 completed successfully with typecheck, lint, tests and build green.
- Domain evaluation precedence is safety restriction, account state, verification, entitlement, then allow.

## Authenticated capability decision adapter — IMPLEMENTED, CI PENDING
- Investigation confirmed Account.status is an authoritative persisted AccountState source.
- AuthenticatedAccountContextService already resolves that account for an authenticated principal.
- Added AuthenticatedCapabilityDecisionService as a narrow adapter into decideCapability().
- Account state is sourced authoritatively; safety restriction remains an explicit requirement input until an authoritative persistence source exists.
- Added focused tests for active and restricted accounts.
- Registered adapter through Nest DI.
- Initial CI exposed a test fixture drift: RequestPrincipal requires authenticationMethod; fixed without changing production semantics.
- Fix commit: 968b6ccc10cbe67c27aa2aab216508ab23fabb6d.

## Exact next action
1. Verify CI for the authenticated capability decision adapter.
2. If green, mark the AccountState-backed integration complete.
3. Investigate the narrowest authoritative SafetyRestriction source before persisting or defaulting restrictions.
4. Keep safety restriction explicit until an authoritative source exists.
5. Record the exact continuation checkpoint.

## Architecture constraints
- RequestPrincipal defines accountId, authenticationMethod and optional verificationLevel.
- AnonymousAuthenticationAdapter currently returns undefined.
- No JWT parser, session store, token format, or external identity-provider contract is currently grounded in the repository.
- Do not replace the legacy capability route with mandatory authentication until a real authentication adapter exists.
- Do not invent identity transport or persistence contracts.
- `packages/database/migrations` is the repository-defined migration artifact boundary.
- The Account migration is derived only from the physical Prisma schema; logical-model fields not present in Prisma are not silently added.
- PostgreSQL is the authoritative relational database and Prisma is the typed database access layer.

## Completed — DO NOT RECREATE
- Project foundation and continuity rules.
- Milestone 0 engineering foundation and CI baseline.
- Canonical domain primitives and tests.
- API application boundary.
- HTTP application integration boundary, correlation propagation and real CI verification.
- Database configuration/migration boundary.
- Account lifecycle, activation, lookup and tests.
- Entitlement lifecycle and tests.
- Verification lifecycle and verification access boundary.
- Request principal resolver boundary.
- Authenticated capability access boundary.
- Safety, moderation and audit domain foundations.
- Analytics, accessibility, operational quality, data lifecycle and deployment requirement foundations.
- Account persistence migration execution gate, including real PostgreSQL CI validation.
