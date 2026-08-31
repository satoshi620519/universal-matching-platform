# Development Status

CURRENT PHASE: Phase 3 — Implementation
CURRENT MILESTONE: Milestone 1 — Core API, database and identity
CURRENT TASK: Validate the corrected application integration and align the new safety enforcement schema with the repository-owned SQL migration contract.
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
- First fix commit: 968b6ccc10cbe67c27aa2aab216508ab23fabb6d.
- Follow-up CI exposed verificationLevel fixture type drift (RequestPrincipal uses string); fixed to '2'.
- Follow-up fix commit: 19bf4dc985056ff0539092d2c60471d8d3d972e9.

## Authenticated capability decision adapter — COMPLETE
- CI #490 and #491 completed successfully after aligning the test fixture with RequestPrincipal's authenticationMethod and string verificationLevel contract.
- Adapter now consumes authoritative Account.status through AuthenticatedAccountContextService.
- Production semantics were unchanged by fixture corrections.

## Safety restriction authoritative source — IN PROGRESS
- Requirements review confirmed restrictions require scope, duration/effective time and auditable lifecycle.
- Current Prisma schema has no persisted enforcement restriction source.
- Added SafetyEnforcement domain primitive with active/revoked/expired lifecycle and effective/expiry evaluation.
- Added focused lifecycle tests.
- Added design checkpoint documenting why authorization must not default restrictions to 'none'.
- Persistence and capability adapter integration remain pending CI validation of the domain slice.
- Persistence implementation started with SafetyEnforcement Prisma model and active-record repository boundary.

## Safety restriction authoritative source — PERSISTENCE IMPLEMENTED, CI PENDING
- Added SafetyEnforcement Prisma model related to Account.
- Added indexed active/effective record query boundary.
- Added SafetyEnforcementRepository abstraction and Prisma implementation.
- Query excludes non-active, future-effective and expired records.
- Domain lifecycle check remains a defensive second evaluation after persistence reconstruction.
- Added focused repository query test.
- Registered repository through Nest DI.
- Persistence commits: 4f1d0ad0be72fbe6d0e122c5a2a01b93aec34f41, 22b172dba79967360a385ac7e3c248c3814d7170, 4663949881bb4f8f4b911f09ceeef5addb0ae8c9, 1a88b5318430b8b4e345041de5dfcd7c5559aa40, b3816daa01657f9e77b6fea7a250e2bf7bdfaf1b.
- CI exposed a persistence-to-domain type boundary: Prisma strings are not domain SafetyRestriction unions; explicit reconstruction mapping added in 8e754c62ad24fb42836443b4e70320954370c1ac.

## Safety restriction persistence — CI VALIDATING
- CI #503 typecheck and lint are green; tests/build were still running at the latest checkpoint.
- Follow-on documentation CI #504 is also running.

## Effective safety restriction resolver — IMPLEMENTED, CI PENDING
- Added resolveEffectiveSafetyRestriction() for deterministic reduction of multiple active records.
- Scope semantics:
  - communication-restricted applies only to communication scope.
  - feature-restricted applies to all protected scopes.
  - suspended applies to all scopes.
- Deterministic precedence:
  1. suspended
  2. communication-restricted within communication scope
  3. feature-restricted
  4. none
- Added focused tests for empty records, scope applicability and simultaneous restriction precedence.
- Resolver intentionally consumes already-active records; lifecycle filtering remains the repository/domain lifecycle responsibility.

## Safety enforcement authoritative source — APPLICATION INTEGRATION IMPLEMENTED, CI PENDING
- Added EffectiveSafetyRestrictionService.
- Loads authoritative active enforcement records through SafetyEnforcementRepository.
- Reduces records using resolveEffectiveSafetyRestriction() and requested capability scope.
- AuthenticatedCapabilityDecisionService now resolves safety restrictions authoritatively instead of accepting caller-supplied SafetyRestriction.
- Existing domain decision precedence remains unchanged.
- Added focused application service test and updated capability decision tests.
- Registered effective resolver through Nest DI.

## Safety enforcement application integration — FIXED, CI PENDING
- CI #513 exposed one stale test constructor after AuthenticatedCapabilityDecisionService gained EffectiveSafetyRestrictionService dependency.
- Root cause was a missed fixture update in the restricted-account test; production code was not implicated.
- Fixed all test construction paths to inject the authoritative resolver.
- Fix commit: 32572a03597aacb390e0e69cd0c277680d824624.

## Migration compatibility — IMPLEMENTED AT ARTIFACT LEVEL
- Repository investigation found migrations are owned by packages/database/migrations, not Prisma's default app-local migrations directory.
- Existing contract requires ordered immutable SQL artifacts and schema_migrations tracking.
- Added 0001_create_safety_enforcements.sql with Account foreign key and repository query index.
- The concrete migration runner and empty-database integration gate remain separate pending infrastructure implementation; no runner behavior was invented.

## Safety enforcement authoritative source — IMPLEMENTATION COMPLETE, CI HISTORY GREEN
- Application integration fixture fix passed CI #515.
- SQL migration artifact passed CI #516.
- Domain lifecycle and effective restriction resolver slices had already passed CI.
- Safety restrictions are now loaded from an authoritative persistence boundary before authenticated capability decisions.

## Migration workflow — INVESTIGATED AND CORRECTED
- Repository contains a migration planning/execution abstraction in packages/database/src:
  - filename parsing and duplicate-version rejection
  - pending migration planning
  - executor interface with atomic-apply contract
- There is not yet a concrete PostgreSQL runner/driver adapter or empty-database integration gate.
- During investigation, the initial safety artifact was found to duplicate existing version 0001.
- This would be rejected by the repository migration contract before execution.
- Removed the duplicate artifact and reissued it as 0004_create_safety_enforcements.sql.
- Corrective commits: d878ea6b12030e59f83437e45b0d475b45fb8d23, 6c1cc7f5906a98d019cd92ebf2f56c3b2a21e022.

## Migration version correction — CI GREEN
- CI #519 passed after reissuing the safety enforcement artifact as version 0004.
- This confirms repository CI accepts the corrected artifact naming and schema changes.

## Migration sequence regression guard — IMPLEMENTED, CI PENDING
- Added a focused migration planning test using the repository's committed logical artifact sequence:
  0001 accounts → 0002 authentication identities → 0003 verification → 0004 safety enforcements.
- The test asserts numeric ordering and uniqueness through the real migration planning primitive.
- This guards against reintroducing duplicate versions while keeping filesystem discovery separate from pure planning logic.
- Commit: 0770dd8a9c1ff85f9d9aec21e89390ce3e351ea2.

## Exact next action
1. Verify CI for the migration sequence regression guard.
2. Inspect package and application database dependencies to identify the selected PostgreSQL access technology.
3. If a supported driver boundary already exists, design the smallest concrete MigrationExecutor adapter around it.
4. Add execution integration only after the adapter can be tested against an empty database.
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
