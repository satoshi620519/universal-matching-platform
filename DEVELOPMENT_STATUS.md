## Milestone 3 persistence preparation — DOMAIN PORTS ESTABLISHED
- Inspected repository package conventions before adding persistence implementation and found no existing generic profile/category repository to duplicate.
- Added domain-owned ProfileRepository port with find/save/delete identity operations.
- Added CategoryRepository port with stable id/key lookup, list and save operations.
- Added compile-time contract tests and package exports.
- Commits: d98cbde242d07a77ae8d82d235ca4d9a76230409, 28fceebc150339747ebd1e5a801b79136a430c9c, ccc506b6ec0064f520b5657c403600fbae30d2e5, 449d0c5e038c9d54559312bf7f875ef0114df8df.
- Next exact task: inspect authoritative application persistence technology/schema location and implement adapters only after locating that boundary; do not invent a second persistence stack.
- CI state: implementation committed; no green status inferred.

## Milestone 3 start — PROFILE, CATEGORY AND GEOGRAPHY DOMAIN BASELINE
- Milestone 2 remains implementation-complete with unavailable CI evidence; avoided further low-value validation loops and started the dependency-ordered next milestone under the documented evidence limitation.
- Added minimal domain-owned Category identity with normalized non-empty id/key/display name.
- Added explicit GeographicScope union (global/country/region) with ISO alpha-2 country validation and non-empty region boundary.
- Added reusable Profile baseline linking account, category, primitive configurable fields and geographic scope; structured field payloads are rejected at the domain boundary.
- Added focused domain tests and package exports.
- Commits: 0a3e98216adbc42ced6bed7e79406dea09ffdfd6, 30a63a80a0cbc3af4ab98aa7c36f44f0bd877650, 34e25d79d8294508c7aa1413e33d277e7332921b, 0661ab144e8e6060bc5e7373b7345bb7c4d716a3, 6b2a93ce184a6655705a96754589b2ea54596c30.
- Next exact task: inspect existing persistence/API conventions and add only the minimum authoritative profile/category/geography persistence slice; privacy-aware projections and category-specific schema validation remain explicit Milestone 3 gates, not yet complete.
- CI state: new implementation committed; no green status inferred.

## Milestone 2 validation evidence check — NO WORKFLOW STATUS PUBLISHED
- Queried GitHub commit combined status and workflow-run associations for the latest implementation commit (ea44f224f3c9a4a4466ebeac30e25cb5279cc150) and latest checkpoint commit (2e79078c351954a72c7118e2a0860bebd528f2ee).
- Both commits returned empty status arrays and empty workflow-run associations.
- Result: there is no accessible CI execution evidence for this commit range; this is an evidence absence, not a passing result.
- Milestone 2 remains implementation-complete but not formally green/closed. Do not repeat migration edge-case expansion solely to manufacture progress; the next meaningful work requires obtaining/running validation infrastructure or moving to the explicitly planned next milestone under a documented risk decision.

## Filesystem migration source edge completion — EMPTY AND DUPLICATE VERSION BOUNDARIES
- Continued from the exact migration execution completion checkpoint without reopening completed configuration or prior source-boundary work.
- Added regression coverage for an explicitly empty migration directory returning an empty artifact set.
- Added duplicate-version source coverage proving filename ordering/uniqueness validation fails before artifact loading can proceed with ambiguous versions.
- Commit: ea44f224f3c9a4a4466ebeac30e25cb5279cc150.
- CI state: source boundary coverage expanded; latest Milestone 2 workflow validation evidence remains unavailable and green is not inferred.

## Migration execution completion boundaries — NO-OP AND INPUT IMMUTABILITY COVERED
- Continued from the milestone-pointer correction and exact migration orchestration checkpoint without reopening completed implementation slices.
- Added regression coverage proving fully applied migration histories produce an empty result without invoking apply.
- Added an explicit execution-level guard proving executePendingMigrations does not mutate caller-owned migration artifacts.
- Commit: 5037cf6688571f6fbcb8b1dd742d992a83aac9b7.
- CI state: additional regression coverage committed; latest Milestone 2 workflow validation evidence remains unavailable and green is not inferred.

## Status continuity correction — MILESTONE POINTER REALIGNED
- The repository status header was stale and still identified Milestone 1 despite the authoritative checkpoint history showing Milestone 2 configuration implementation as the active completed slice.
- Realigned CURRENT MILESTONE and CURRENT TASK to Milestone 2 validation/closure rather than allowing future sessions to resume from an obsolete Milestone 1 task.
- Did not mark Milestone 2 green or formally complete: accessible workflow evidence for the latest configuration commit range remains unavailable.
- This correction prevents duplicate work and preserves the dependency order: validate/close M2 first, then begin M3 Profiles, categories and geography.

## Migration orchestration boundary continuation — LOAD FAILURE STOPS EXECUTION
- Continued from the exact migration executor failure-boundary checkpoint without reopening completed configuration or migration logic.
- Added regression coverage proving a migration artifact source failure propagates before executor history reads or migration apply calls occur.
- Added an explicit source boundary test documenting that nested directories are ignored while top-level regular files remain subject to the strict migration filename contract.
- Commits: 4a5aaf5c11318f22ed5cc81f78187975dc9db791, 7a32b563ded390701cfda92a2c5fb6aa4b8b8b69.
- CI state: committed orchestration/source boundary coverage; workflow execution evidence remains unavailable and green is not inferred.

## Migration executor failure-boundary validation — REGRESSION COVERAGE ADDED
- Continued from migration artifact source integrity without duplicating completed implementation work.
- Added focused tests for tracking-table initialization failure propagation; history queries must not proceed after initialization failure.
- Added focused tests for migration SQL failure propagation; version recording must not be attempted after SQL execution fails inside the transaction callback.
- Commit: 3fef8084b7ca7a23251831258ffbf369e35071ef.
- CI state: committed failure-boundary regression coverage; workflow execution evidence remains unavailable and green is not inferred.

## Migration artifact source integrity — DIRECTORY CONTENT FAIL-CLOSED
- Continued from migration history integrity validation without reopening completed implementation slices.
- Found that FilesystemMigrationArtifactSource silently ignored regular non-.sql files, allowing unexpected artifacts in a configured migration directory to go unnoticed.
- Changed source loading to pass every regular file through the existing strict filename contract, while directories remain ignored.
- Added regression coverage proving a regular notes.txt file causes source loading to fail rather than being silently skipped.
- Commits: 2cb6ed4767aba89d763a1ea3b0ec54c888310201, ef83bb1f6dd404b43d6111f3689119a250bed9dd.
- CI state: source integrity fix committed; workflow execution evidence remains unavailable and green is not inferred.

## Migration execution history integrity — DUPLICATE HISTORY FAIL-CLOSED
- Continued static validation from the exact prior checkpoint without reopening completed product slices.
- Found that executePendingMigrations collapsed duplicate applied-version history into a Set, silently masking corrupted/duplicate history.
- Added a fail-closed uniqueness check before planning so duplicate applied versions abort before any migration execution.
- Added regression coverage proving no apply call occurs after duplicate history is detected.
- Commits: d829ca7d352017192e462b8ef045c6e091638965, 803dc1602153b1a38ee980ecc8e11562f614e2c0.
- CI state: source-level integrity fix and regression test committed; workflow execution evidence remains unavailable and green is not inferred.

## Repository validation continuation — CONCRETE DUPLICATE IMPORT FIX
- Continued static repository review from the migration validation checkpoint without adding new product functionality.
- Found a concrete duplicate type import in postgres-migration-executor.test.ts; this can trigger lint/type hygiene failures despite otherwise valid test behavior.
- Consolidated runtime and type imports into one type-safe import declaration.
- Commit: 741ba2aa75847c539c25bcd9841b75160b298dff.
- CI state: source-level regression fix committed; workflow execution evidence remains unavailable and green is not inferred.

## Migration planner boundary continuation — APPLIED-STATE CONTRACT TESTED
- Continued from the latest migration validation checkpoint without reopening completed configuration implementation.
- Added focused planner tests proving unknown applied versions do not suppress valid pending migrations and applied-version set ordering cannot affect planning.
- Added an explicit validateMigrationArtifacts immutability/order regression guard.
- Commit: b80b67601190d404ec77b7dad107031f0e329e0a.
- CI state: committed regression coverage; workflow validation evidence remains unavailable, so green is not inferred.

# Development Status

CURRENT PHASE: Phase 3 — Implementation
CURRENT MILESTONE: Milestone 2 — Configuration resolution
CURRENT TASK: Obtain validation evidence for the completed Milestone 2 configuration lifecycle, then formally close the milestone before starting Milestone 3.
STATUS: Milestone 1 foundational gates include prior validated CI evidence; Milestone 2 implementation is complete with expanded regression coverage, but current Milestone 2 CI evidence remains unavailable and must not be inferred.

## Continuation protocol — READ FIRST
GitHub main is the persistent source of truth. Before every new work session:
1. Read this file.
2. Verify the files, commits and CI run named in the latest checkpoint.
3. Do not assume an unverified change passed CI.
4. Resume from the Exact next action section.
5. After every coherent implementation slice, update this file with files changed, commit SHA, CI state, unresolved constraints and the exact next action.

Never overwrite a working boundary based on conversational memory. Prefer repository state and CI evidence.

## Latest checkpoint — 2026-08-31

## Validation hardening continuation — MIGRATION CONTRACT GUARDS STRENGTHENED
- Continued validation work without adding speculative product functionality.
- Reviewed the migration planner source and strengthened concrete boundary tests around the committed filename contract and mutation safety.
- Added regression coverage rejecting uppercase segments/extensions and malformed double-underscore filenames.
- Added guards proving filename ordering and migration planning do not mutate caller-owned arrays/artifacts.
- Commit: e1a1450bfb500785418e4287b775d9c03561fc45.
- CI state: validation evidence still unavailable from accessible workflow history; these are committed regression guards, not inferred green results.

## Repository-source validation continuation — CONCRETE REGRESSION FIX APPLIED
- Resumed from repository state rather than conversational assumptions because DEVELOPMENT_STATUS.md remains the authoritative continuation record.
- Inspected the committed migration sequence regression guard and found a concrete inconsistency: the input included 0008_create_audit_records.sql but the expected ordered result stopped at 0007.
- Corrected the expected sequence to include migration 0008, preventing a false failing regression test as the committed migration set grows.
- Commit: 0be6af15ab2e9fb4dc83f42fddbef5867373a604.
- CI state: commit created; validation evidence still pending. Do not infer green.


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

## Migration sequence regression guard — CI GREEN
- CI #521 passed for the focused repository migration sequence guard.
- Existing pure migration planning logic now has an explicit regression test covering the committed logical sequence.

## PostgreSQL migration executor adapter — IMPLEMENTED, CI PENDING
- Database dependency investigation found no concrete SQL driver dependency inside @universal/database.
- API uses Prisma, but packages/database intentionally remains driver-neutral.
- Added a narrow SqlMigrationClient port instead of coupling the migration package directly to Prisma internals.
- Added PostgresMigrationExecutor implementing the existing MigrationExecutor contract:
  - creates schema_migrations tracking table if needed
  - lists applied versions in order
  - applies migration SQL and version recording inside one transaction boundary
- Added focused contract tests using a fake SQL client.
- This is an adapter contract implementation, not yet an application-wired production database client.
- Commits: 66ff98cd30b91e38631da89630981f979cd2f9b1, 482e2dd8c1e8b4599dedfec26f38787e0a31e9ea, 69bebb8b37b53f98136f3d35c68b31c06200640a.

## PostgreSQL migration executor adapter — CI GREEN
- CI passed for the driver-neutral PostgresMigrationExecutor and its contract tests.

## Prisma runtime adapter investigation — BLOCKED BY ATOMICITY MISMATCH
- DatabaseService extends PrismaClient and supports raw queries plus interactive transactions.
- A naive SqlMigrationClient adapter was prototyped and immediately rejected before retention.
- Root issue: the existing SqlMigrationClient.transaction(() => ...) port does not pass a transaction-scoped query client into the callback.
- Therefore queries issued through a captured root PrismaClient would not be guaranteed to execute inside Prisma's interactive transaction.
- The prototype and its tests were removed; no unsafe production adapter remains.
- This is a contract-design issue, not a Prisma capability issue.
- Next change must evolve the SqlMigrationClient transaction port so the transaction callback receives a transaction-scoped SqlMigrationClient/query boundary, then update PostgresMigrationExecutor and tests accordingly.

## Migration transaction boundary — REFACTORED, CI PENDING
- Refactored SqlMigrationClient so transaction() supplies a transaction-scoped query client.
- PostgresMigrationExecutor.apply() now performs migration SQL and schema_migrations version recording exclusively through tx.
- Added focused regression coverage around transaction-scoped query execution.

## Safe Prisma migration adapter — IMPLEMENTED, CI PENDING
- DatabaseService's PrismaClient interactive transaction is now adapted without leaking root-client queries into the transaction.
- PrismaSqlMigrationClient wraps the interactive tx client in a transaction-scoped SqlMigrationQueryClient.
- Migration SQL and tracking writes use the transaction-scoped adapter.
- Root client query use is explicitly regression-tested as absent during transaction work.
- Raw SQL is restricted to repository-owned migration artifacts and fixed executor SQL; migration inputs are not caller-provided.
- Adapter commits: 7997934e4a83a34b8490ffdb1cb452ae2a55e87a, d3a87d6cef6b62e5eb522c122d65354796ebe357, 4333b17994a6d3496158e3dc2e14a38027671bf0, 9bf846ec5abeb5a752d58c293355909c46e62f26.

## Safe Prisma migration adapter — CI TYPECHECK FAILURE IDENTIFIED AND FIXED
- CI #535/#536 failed in @universal/database typecheck, before lint/test/build.
- Root cause: the transaction-scoped executor test referenced a query symbol outside its lexical scope and constrained the generic transaction callback to Promise<void>.
- Production transaction port and Prisma adapter were not implicated.
- Rewrote the focused test with explicit SqlMigrationClient / SqlMigrationQueryClient types and a generic transaction implementation.
- Regression assertion now explicitly proves apply() does not call the root query client.
- Fix commit: 3cf9e86c231a3fbf7023407cc4faf3faae30a659.

## Transaction-scoped executor test — SECOND TYPECHECK FAILURE FIXED
- CI #537/#538 still failed in @universal/database:typecheck.
- Exact remaining error: Vitest mock for txQuery returned Promise<void>, which is narrower than the generic query<T>() => Promise<T> contract.
- Production executor and adapter remained type-correct; only the typed test double was invalid.
- Replaced the mock implementation with a generic async query function returning Promise<T>.
- Fix commit: 399fbe8bb99693fc8917d9d912cae90e06855d1f.

## CI PostgreSQL topology discovered
- Existing CI already provisions PostgreSQL 16 as a service container.
- This is the correct topology to reuse for the first empty-database migration integration test after the current typecheck fix is green.
- No second database topology should be invented.

## CI PostgreSQL wiring — VERIFIED
- Existing CI uses PostgreSQL 16 service container.
- DATABASE_URL is wired to postgresql://postgres:postgres@localhost:5432/universal_matching.
- This exact topology is the authoritative target for the first migration integration test.

## Migration runtime composition — IMPLEMENTED, CI PENDING
- Corrected package export surface: PostgresMigrationExecutor and SQL migration port types are now exported from @universal/database.
- Added Prisma runtime composition factory:
  DatabaseService → PrismaSqlMigrationClient → PostgresMigrationExecutor.
- Registered the composed executor in the global DatabaseModule via MIGRATION_EXECUTOR injection token.
- Added focused composition test proving the API database service produces the concrete PostgreSQL migration executor.
- No automatic startup migration was introduced; execution remains an explicit next concern.
- Commits: 6b9aa13603aad8b86c5d3c35b1dfabb8576e8597, 40f8e3d77052100697e4e6aafaa346a090536593, 9cdccaf554984d2cf4ab99f84ff27d6912590bca, e85c4a40f1fb4357e742e3818953126259d92f11.

## Migration runtime composition CI — FAILURE UNDER INVESTIGATION
- CI runs #544/#545 failed at monorepo typecheck before lint/test/build.
- Failure happened after runtime composition commits, so composition cannot yet be treated as green.
- Workflow job confirms PostgreSQL service started successfully; database topology is not the failure point.
- GitHub job-log retrieval returned no decoded compiler text in this session, so no error message is being fabricated.
- Static source inspection found and removed a stale unused Prisma type import from the new migration adapter.
- Commit: 716f93f2e1114671375aab2a21e7d3b8370f673c.
- Further CI diagnosis must use the next run's exact compiler output before additional speculative production changes.

## Migration artifact discovery — INVESTIGATED
- Authoritative repository artifacts currently live under packages/database/migrations.
- Production package exports source TypeScript directly and has no asset-copy pipeline for SQL files.
- Therefore runtime filesystem discovery inside built API output is not yet production-safe.
- Do not add automatic startup migration or pretend artifacts are bundled until an explicit artifact-loading strategy exists.
- Candidate next design: injected MigrationArtifactSource port, with filesystem implementation added only alongside packaging/copy guarantees and a test fixture implementation for integration.

## CI status — STILL RED, NO FABRICATED ROOT CAUSE
- Latest CI #546/#547 remained red at typecheck.
- PostgreSQL service initialization is successful.
- GitHub log endpoint continues returning 404/no decoded compiler diagnostics for this job in the current connector session.
- The stale Prisma import removal did not make CI green, so it was not the sole failure.
- No speculative production-code changes were stacked against an unknown compiler error.

## Migration artifact source and explicit orchestration — IMPLEMENTED, CI PENDING
- Added MigrationArtifactSource port to separate artifact loading from migration execution.
- Added StaticMigrationArtifactSource as a deterministic non-filesystem implementation for tests/composition.
- Added runMigrations(source, executor), which explicitly loads artifacts and delegates to executePendingMigrations.
- No automatic application-startup migration was introduced.
- Runtime filesystem assumptions remain intentionally absent until SQL asset packaging is guaranteed.
- Commits: bfacbefc6ba35489a811a325f1f9af090f9473bf, de283f6bf79daa7f40255c5e3b190eb2dde420c4, 294c3f61ba26097034c99cc713257753f28af630, f4485e23f3d77b294eb89583eedcc8eebe780522, 6d2784d9c45ffd8c16d46518fcd5ad539d51dad1, 09460d9b921498970a658c1178595d3278eebb83.

## Production SQL migration artifact packaging — IMPLEMENTED, CI PENDING
- Added an explicit package build asset step that copies packages/database/migrations/*.sql into packages/database/dist/migrations.
- Added FilesystemMigrationArtifactSource(directory), which requires an explicit directory and never guesses the application working directory.
- Filesystem source parses filenames through the existing migration parser and validates the complete plan before returning artifacts.
- Added isolated filesystem loading test with a temporary directory.
- Database package metadata now declares packaged output assets.
- Commits: 9789842d603eb099f9967f502492e24981f2bf19, 89d350c49b943765f81dbd486989fc47fff072f7, 832b14f29e94912fb835a1e4ab6e74013980a390, f924f419cb9887b4b7df9887846fe3624a2c9008, 91b6316ef17f092865a91c3e53efb1a9de3b56d0.

## CI baseline typecheck remains red
- Latest observed CI still fails at pnpm typecheck before tests/build.
- Exact compiler diagnostics remain unavailable through the current GitHub connector log endpoint.
- Do not mark new migration packaging work green until CI proves it.
- New work was kept isolated and follows existing strict TypeScript/NodeNext conventions.

## Compiled migration asset verification — IMPLEMENTED, CI PENDING
- Added a real build-output verifier that compares source migration filenames with dist/migrations filenames after package build.
- Verification fails if any SQL migration is omitted or an unexpected SQL artifact appears in the compiled package.
- Added package script verify:migrations-build to build and verify the exact production artifact set.
- Commits: 1397ddd98b707d56382af5e756d7c8e330f10e4c, 98e959021045b8185ff989347f6f9c6c5d154cc5, 4cf86504505baf9ec4e2a998fc31743527f3f9b7.

## CI typecheck diagnosis — INFRASTRUCTURE HISTORY CONFIRMED
- CI continues to fail before test/build at pnpm typecheck.
- Job metadata confirms no DB service failure and no test execution has occurred.
- Repository history shows prior monorepo-wide typecheck failures were fixed by correcting per-app tsconfig include inputs.
- Current tsconfigs already include src/**/*.ts across applications and packages, so that historical fix is present.
- Exact current compiler diagnostics are still unavailable through the connector's log endpoint; no unrelated tsconfig edits were made without evidence.

## Typecheck diagnostics pipeline — IMPLEMENTED, AWAITING FIRST ARTIFACT
- CI previously ran pnpm typecheck without preserving compiler output as a downloadable artifact.
- Added named Typecheck step that tees stdout/stderr into typecheck.log.
- Added always-run upload-artifact step named typecheck-diagnostics so failure diagnostics survive even when later CI steps are blocked.
- Commit: 05cc19a096c9c7061010f65a64e4b134d232f8ee.
- Next failed run can be diagnosed from the exact compiler output artifact instead of speculative source changes.

## Compiled migration verification remains implemented
- Source-to-dist SQL migration verification is complete in repository code.
- Pipeline remains blocked by baseline typecheck, so CI success has not yet been claimed.

## CI diagnostics pipeline correction — IMPLEMENTED, AWAITING VALID RUN
- Investigation found the previous diagnostics workflow edit had accidentally written literal "\\n" characters into .github/workflows/ci.yml.
- That malformed YAML explains the immediate workflow failures with empty job/artifact lists: the workflow could not be parsed/executed normally.
- Restored valid YAML with separate Typecheck and always-run Upload typecheck diagnostics steps.
- Commit: fcee643dad32cd16a9b868f1ecccd088029b2629.
- This is a CI workflow syntax correction, not a TypeScript source-code diagnosis.

## CI diagnostics — EXACT TYPECHECK ERRORS CAPTURED AND FIXED
- Valid diagnostics artifact was successfully produced and downloaded from CI run #568.
- Typecheck passed all packages except @universal/database.
- Exact errors were:
  1. FilesystemMigrationArtifactSource imported non-existent assertValidMigrationPlan.
  2. FilesystemMigrationArtifactSource treated parseMigrationFilename() number result as an object with .version.
  3. PostgresMigrationExecutor test rootQuery mock did not satisfy the generic SqlMigrationQueryClient query signature.
- Applied minimal fixes:
  - Use orderMigrationFilenames() for validation/order and parseMigrationFilename() numeric return directly.
  - Return loaded MigrationArtifact array after validated ordering.
  - Make rootQuery mock generic with Promise<T>.
- Commits: 27574508808c4b046762cc566a7fe75a21a70f95, e2ea949428921031381b59278b917f339143bbcb.
- This is the first diagnosis based on exact CI compiler output rather than speculation.

## Pipeline state after diagnosis
- Typecheck was GREEN through 8 other packages; only @universal/database had the three captured errors.
- Lint had failed only because typecheck was fixed enough to unblock it, exposing the next gate.
- Test/build were skipped in run #568 because lint failed.
- Need to verify the new fixes before claiming typecheck or baseline CI green.

## Typecheck gate — GREEN
- CI run #571 confirmed Typecheck success after the exact three compiler fixes.
- PostgreSQL service setup and dependency installation also remain green.
- The pipeline now fails at the next real gate: pnpm lint.
- Added lint.log capture and always-run lint-diagnostics artifact upload to expose exact lint output on the next run.
- Commit: 10cf8696cf8bac0a3a5dae74d83141a45b143ea7.

## Pipeline progression
- Install: GREEN
- Typecheck: GREEN
- Lint: RED, exact diagnostics capture added
- Test: blocked by lint
- Build: blocked by lint

## Lint diagnostics — EXACT ERROR CAPTURED AND FIXED
- CI run #572/#573 path confirmed Typecheck GREEN and Lint reached execution.
- lint-diagnostics artifact was successfully downloaded and inspected.
- Exact remaining lint/type contract errors were both in packages/database/src/postgres-migration-executor.test.ts:
  - Vitest Mock inference erased the generic query<T> signature and exposed Promise<unknown>.
- Applied minimal fix by explicitly typing rootQuery as SqlMigrationQueryClient['query'], preserving the production generic contract.
- Commit: 6c8c3ebb9ebff5d35af0a038c41eea1fb75697a4.

## Pipeline progression
- Install: GREEN
- Typecheck: GREEN
- Lint: exact two errors fixed, CI verification pending
- Test: next gate
- Build: pending

## Lint gate — GREEN, test diagnostics pipeline added
- CI run #574 confirmed Typecheck GREEN and Lint GREEN after the generic mock contract fix.
- The next real gate is pnpm test, which now fails while build remains blocked.
- Added test.log capture and always-run test-diagnostics artifact upload to expose exact failing test output.
- Commit: f1c3a72d3f4281e432aec71272a38fbd8ffce7f1.

## Pipeline progression
- PostgreSQL service: GREEN
- Install: GREEN
- Typecheck: GREEN
- Lint: GREEN
- Test: RED, exact diagnostics capture added
- Build: blocked by test

## Baseline CI gate audit — Test GREEN, Build is the only remaining blocker
- CI run #577 was audited before starting any new implementation work to avoid duplicating parallel-chat work.
- Confirmed successful gates: PostgreSQL service, install, Typecheck, Lint, Test.
- Build is the only failing gate.
- Added build.log capture and always-run build-diagnostics artifact upload.
- Commit: a2381d241631a7e6b777845c632b66d5ab001e7d.
- No migration implementation was duplicated in this pass.

## Coordination rule
- Before each work pass, read current DEVELOPMENT_STATUS.md and inspect the latest repository/CI state.
- Treat repository commits and status file as the source of truth; do not repeat a completed task merely because an older chat checkpoint says it is pending.
- Record completed work, exact evidence, commit SHA, and next action after every pass.

## Pipeline progression
- PostgreSQL service: GREEN
- Install: GREEN
- Typecheck: GREEN
- Lint: GREEN
- Test: GREEN
- Build: RED, diagnostics capture added
- Baseline CI: waiting only on Build

## Baseline CI — FULLY GREEN
- CI run #578 completed successfully with PostgreSQL service, install, Typecheck, Lint, Test and Build all green.
- The previous build-only blocker no longer exists; no build fix was required after the diagnostics workflow change.
- This is the first fully green baseline after migration packaging work.

## Migration artifact integrity hardening — IMPLEMENTED, CI PENDING
- Before starting new integration work, repository HEAD and status were re-read to avoid duplicating parallel work.
- Identified a real consistency gap: filesystem loading parsed filename versions, but arbitrary MigrationArtifact objects could declare a version inconsistent with their filename.
- Added validateMigrationArtifacts() to verify filename/version agreement, duplicate versions and numeric ordering.
- planMigrations() now uses the shared validation primitive.
- FilesystemMigrationArtifactSource also uses the same primitive after loading SQL.
- Added regression coverage for filename/version mismatch.
- Commits: a94154f90496e85f1825da9df30592063bac7d55, 791cf62abf313e15a50aa4da937645a75f0324a0, 8e3a79e98bda5cb9c0feb6269594f466034d92ef, 25332235a45b3f4135edb2b142ecdb0075053af7.

## Coordination rule
- Before each work pass, read current DEVELOPMENT_STATUS.md and inspect repository HEAD plus latest CI.
- Repository state wins over older conversational checkpoints.
- Record exact evidence, commits and the next action after each coherent slice.


## Filesystem migration execution integration — IMPLEMENTED, CI PENDING
- Re-read repository HEAD and existing migration tests before adding coverage to avoid duplicating the existing executor, runner and filesystem unit tests.
- Added an integration-level test that composes FilesystemMigrationArtifactSource with runMigrations() across an empty migration history.
- Coverage verifies filesystem ordering reaches execution in version order and verifies a fully applied history performs no duplicate execution.
- This keeps migration execution explicit and does not introduce application-startup migration.
- Commit: b194a9eb39974bd0a3c2f4cd523884f19cce58c5.


## Prisma migration executor PostgreSQL integration — IMPLEMENTED, CI PENDING
- Verified the prior real PostgreSQL migration test uses an older direct runner path and does not exercise the current production runtime composition.
- Added real PostgreSQL integration coverage for DatabaseService → PrismaSqlMigrationClient → PostgresMigrationExecutor.
- From an empty schema_migrations history, coverage verifies tracking-table initialization, migration SQL application and recorded version retrieval.
- Added a failing-SQL case proving the transaction does not record the failed version.
- This closes the runtime-adapter integration gap without introducing automatic startup migration.
- Commit: 096bfdc5d46cc2a95470617804d2b4387e61a8e1.


## Full filesystem-to-PostgreSQL migration integration — IMPLEMENTED, CI PENDING
- Re-checked the latest commits and existing real PostgreSQL coverage before adding another test.
- Confirmed the missing composition was the full production-style path: repository SQL files → FilesystemMigrationArtifactSource → runMigrations → PostgresMigrationExecutor → PrismaSqlMigrationClient → PostgreSQL.
- Added empty-database coverage that applies the repository migration set [1,2,3,4], then verifies a second run is a no-op and the recorded history is intact.
- No automatic application-startup migration was introduced.
- Commit: 89d007aec20fb9c71ba23fe7589e3bec2134dc0d.


## Full migration integration sequence correction — IMPLEMENTED, CI PENDING
- Re-read the repository status and latest migration integration tests instead of assuming the prior checkpoint was complete.
- Found a concrete coverage drift: the full filesystem-to-PostgreSQL test claimed repository migrations [1,2,3,4] but did not clean up or assert the 0004 safety_enforcements table.
- Updated the integration fixture to include safety_enforcements in empty-database setup/cleanup and to assert the complete resulting table set.
- This turns the test into a real regression guard for the full committed migration sequence rather than only schema_migrations version numbers.
- Commit: 96c0ca4ff8341cc45e1cb9884856a795192836a8.


## Safety restriction DI integration correction — IMPLEMENTED, CI PENDING
- Re-read the actual AppModule after completing migration coverage and resumed from the next Milestone 1 integration gap.
- Found a concrete Nest DI wiring defect: EffectiveSafetyRestrictionService depends on the abstract SafetyEnforcementRepository, but AppModule registered PrismaSafetyEnforcementRepository without binding the abstraction token.
- This could leave the authenticated capability decision path unable to instantiate in a real application context despite focused unit tests passing.
- Added SafetyEnforcementRepository → PrismaSafetyEnforcementRepository binding using useExisting.
- Commit: 2ad6700852ddf9788471efcb072eb0d703a569be.


## Safety DI regression guard — IMPLEMENTED, CI PENDING
- Latest workflow lookup still returned no workflow runs, so CI remains explicitly unverified.
- Added a focused AppModule metadata regression test for the newly corrected SafetyEnforcementRepository abstraction binding.
- The test verifies both the concrete Prisma provider and the useExisting abstraction mapping, preventing a future silent removal of the runtime wiring.
- Commit: 9a31e3c754f16a8e826f149170daea5d06534cc3.


## Account deletion lifecycle boundary — COMPLETE
- Resumed from repository state after the safety DI regression guard instead of adding duplicate migration or DI work.
- Traced REQ-AUTH-005 against the existing AccountState transition model and found the lifecycle states already exist but no deletion/privacy implementation boundary was recorded.
- Added ACCOUNT_DELETION_LIFECYCLE_BOUNDARY.md defining pending-deletion as the safe first production transition and deleted-anonymized as an explicit later operation.
- Explicitly deferred destructive deletion, retention timers, legal holds, anonymization mappings and external-provider cleanup until privacy lifecycle policy is defined.
- Commit: f12029c2338d33096effe3f85ca066a7ac128dc2.


## Authenticated account deletion request — IMPLEMENTED, CI PENDING
- Implemented the smallest safe production slice identified by ACCOUNT_DELETION_LIFECYCLE_BOUNDARY.md.
- Added authenticated self-service transition to pending-deletion using the existing AccountState transition rules and AccountRepository boundary.
- The HTTP boundary derives the target only from the authenticated principal; no arbitrary account identifier is accepted.
- Added transition tests covering all eligible states and rejection of terminal/already-pending states.
- Deliberately did not implement hard deletion, anonymization, retention timers, legal holds, or provider cleanup.
- Commits: 3ce2f55a, 6fcbbda9, 19425c01, 7b1a636e, 313c0709.


## Authenticated pending-deletion integration regression coverage — IMPLEMENTED, CI PENDING
- Added service-level coverage proving the deletion target comes exclusively from the authenticated principal context and persists pending-deletion through AccountRepository.
- Added disappearance handling coverage for the persistence race returning null.
- Added controller-level coverage proving the HTTP boundary derives identity from authentication and rejects unauthenticated deletion requests.
- No destructive privacy operation was added.
- Commits: 6d386cdbc3a88f90e5db211df7129f59ea23550a, 1291b4b5530dca85c43c30ef7c31723b2c2f30e7.


## Pending-deletion production slice — IMPLEMENTATION COMPLETE, CI EVIDENCE PENDING
- Re-read the repository status and requirements after completing service/controller regression coverage.
- Confirmed the safe deletion slice is now coherent: authenticated principal → account context → domain transition → AccountRepository persistence.
- Added ACCOUNT_DELETION_LIFECYCLE_IMPLEMENTATION.md as a durable completion boundary so future work does not confuse pending-deletion with destructive erasure.
- Explicitly preserves the block on hard deletion, anonymization, retention scheduling, legal holds and provider cleanup pending policy.
- Completion record commit: 54339486d07ab2228aaf2775f08ffbe4242e19cf.


## Authenticated capability verification source — IMPLEMENTED, CI PENDING
- Resumed from the current repository checkpoint and removed a trust-boundary flaw in authenticated capability access.
- AuthenticatedCapabilityAccessService previously converted RequestPrincipal.verificationLevel into CapabilityContext, allowing authorization to depend on a principal claim rather than the authoritative verification persistence path.
- It now resolves the authenticated account, loads the latest usable VerificationRecord through VerificationService, and derives currentVerificationLevel server-side; no usable record maps to level 0.
- The supplied principal verificationLevel is no longer used for authorization decisions.
- Added regression coverage proving a forged higher principal claim cannot override a lower persisted level, and that sufficient/missing persisted outcomes behave correctly.
- Commits: 0a0f1f1cf17157198a668e6a797f7fd3880ccafe, b11a8a04fbe791b72edd501bde0ce7bb1218c97c.


## Authenticated capability HTTP regression alignment — IMPLEMENTED, CI PENDING
- Re-read the affected controller tests after changing AuthenticatedCapabilityAccessService to require the authoritative VerificationService source.
- Found concrete fixture drift: the controller test still constructed the service with the old two-argument signature and asserted principal-claim semantics.
- Updated the HTTP-boundary tests to inject a persisted verification source and verify authenticated access follows that server-side level rather than the principal claim.
- This closes the immediate compile/test regression risk introduced by the trust-boundary correction.
- Commit: 81b309137950682014bba7ee0bdd48ab46057daf.


## Safety enforcement concrete provider registration — IMPLEMENTED, CI PENDING
- Re-read the current AppModule rather than relying on the earlier DI checkpoint.
- Found a second concrete DI defect: SafetyEnforcementRepository was bound with useExisting to PrismaSafetyEnforcementRepository, but the concrete PrismaSafetyEnforcementRepository class itself was absent from the providers array.
- The abstraction binding alone is insufficient because Nest cannot alias a provider that was never registered.
- Registered PrismaSafetyEnforcementRepository explicitly; the existing AppModule regression test now covers both requirements.
- Commit: f9d68d2ddbf0741e95da7fd5dc239081ca0822a3.


## Email/password credential implementation boundary — COMPLETE
- Re-read requirements and repository architecture after the latest integration fixes instead of expanding already-complete deletion/safety slices.
- Identified the next independent Milestone 1 gap: DECISIONS.md selects email/password as an initial capability, but no credential persistence boundary exists beyond provider-neutral AuthenticationIdentity.
- Added EMAIL_PASSWORD_AUTHENTICATION_IMPLEMENTATION_BOUNDARY.md.
- Defined the smallest safe next slice as a dedicated credential model linked to AuthenticationIdentity, explicitly keeping password hashes out of Account and deferring JWT/session/reset-token/provider choices.
- Boundary commit: 595066ccb96c82f1fe623fb878c3eb34a1087a7a.


## Dedicated password credential persistence — IMPLEMENTED, CI PENDING
- Continued from EMAIL_PASSWORD_AUTHENTICATION_IMPLEMENTATION_BOUNDARY.md and inspected the actual AuthenticationIdentity schema/repository conventions.
- Added PasswordCredentialRepository with create, lookup, password-hash replacement and credential status operations.
- Added PrismaPasswordCredentialRepository; password material is scoped to AuthenticationIdentity rather than Account.
- Added additive Prisma model and immutable migration 0005_create_password_credentials.sql.
- Registered the concrete provider and abstract repository token in AppModule.
- Explicitly did not implement password hashing algorithms, sign-in tokens/sessions, reset tokens, email delivery or OAuth/OIDC.
- Commits: 923fba9b, 61334e6d, 0307cc68, dc95c563, 7d67b07c, 1682a6f8.


## Password credential persistence regression coverage — IMPLEMENTED, CI PENDING
- Added focused PrismaPasswordCredentialRepository behavior coverage for default lifecycle state, absent lookups, identity-scoped hash replacement and no-match handling.
- Strengthened the abstract repository contract guard to cover all persistence operations.
- Added PASSWORD_CREDENTIAL_PERSISTENCE_VERIFICATION.md recording Prisma/migration alignment and the rule that PasswordCredentialRecord must not leak into account/profile projections.
- Static coverage does not substitute for actual migration execution; CI/database evidence remains pending.
- Commits: 10171f1c98d3ed198ac9fc5f155a824ecc9624a0, 1ff31d067f44401461a14166a4321abf1d6509ee, 809ab9c0063c92de31498c49cf9570933f33248b.


## Password hashing abstraction — IMPLEMENTED, CI PENDING
- Inspected existing package dependencies and found no established password-hashing dependency, so introduced an explicit application abstraction rather than coupling registration/sign-in code directly to a library.
- Added PasswordHasher and NodeScryptPasswordHasher with opaque versioned hashes, random salts, verification and malformed-format rejection.
- Registered the concrete hasher plus abstract DI token in AppModule.
- Added regression coverage for correct verification, wrong-password rejection, malformed hashes and distinct salts.
- Explicitly kept plaintext out of repositories and deferred registration transport, sign-in/session issuance, reset delivery and credential policy.
- Commits: 65f8ef6174e6d7d64f2f8b9d304797571800d358, d7d562042893a0b74331e5cd906f90c3ff6fb79c, db05c4b40a93999c2c5f46a199dd34eb76a82f31, 5761a050b32fd1ce3e66517be8b760873f9168a0, b8a568008af7d4970d1e4bc07d467b975063f56f.


## Password registration atomicity boundary — COMPLETE
- Inspected AccountRepository, AuthenticationIdentityRepository and PasswordCredentialRepository before implementing the requested registration flow.
- Identified a correctness boundary: the workflow requires three dependent writes, while current repositories have no shared transaction/unit-of-work abstraction.
- Avoided implementing a superficially complete registration service that could orphan an account or identity if a later credential write fails.
- Added PASSWORD_REGISTRATION_USE_CASE_BOUNDARY.md defining the required atomic workflow and the next prerequisite: a transaction-capable registration persistence boundary that receives only an opaque password hash.
- Boundary commit: f2bbb88b3ccfbde92f53593095d54930ce7f68a8.


## Atomic password registration persistence boundary — IMPLEMENTED, CI PENDING
- Inspected DatabaseService and confirmed the Prisma interactive transaction boundary is available through $transaction.
- Added PasswordRegistrationRepository so the dependent Account, AuthenticationIdentity and PasswordCredential writes are represented as one persistence operation.
- Added PrismaPasswordRegistrationRepository using one transaction callback; credential persistence receives only passwordHash.
- Added focused regression coverage asserting all three writes occur through the transaction and failures propagate without a fallback write path.
- Registered concrete and abstract repository providers in AppModule.
- Commits: 72e921cf1b9e96ee4ca137f007ad9142fb03efb0, 93cbea6e76b4203746eeaf3948e6897c30c4645c, 2292a4177fdfb48422429c6474986e9b30a43bb7, b1cf721a1ab28c82430c1d0b9e6c317bb020f0a6.


## Password registration application service — IMPLEMENTED, CI PENDING
- Added PasswordRegistrationService on top of the atomic registration repository.
- The service hashes plaintext through PasswordHasher before persistence and creates pending Account + active email-password AuthenticationIdentity + active PasswordCredential through the single transaction boundary.
- Added regression coverage for plaintext-to-hash ordering, hashing failure with zero persistence calls, and transaction failure propagation without fallback writes.
- Registered PasswordRegistrationService in AppModule and documented PASSWORD_REGISTRATION_APPLICATION_FLOW.md.
- Intentionally did not expose an HTTP endpoint before defining transport validation, duplicate identity semantics, email normalization, password policy and rate limiting.
- Commits: 40f430296bf92aa79ea910e955eb70748b46c272, ab874d10e4b832ebc70f3c440d450ebffd60f4ef, 90af49876e6c5023d3ec30bbf7b2f73daac0f280, b5a0ee89e3fa8cc2e658e58f141a753b61b604d3.


## Registration transport prerequisites and password policy — IMPLEMENTED/DEFINED, CI PENDING
- Re-read REQ-AUTH-001 and REQ-SAFE-006 before exposing registration transport.
- Added REGISTRATION_TRANSPORT_SEMANTICS.md defining explicit prerequisites for provider-subject normalization, duplicate identity behavior, password policy and rate limiting.
- Added PasswordPolicy abstraction and MinimumPasswordPolicy with explicit 12-character minimum and bounded maximum input length; hashing remains separate from policy.
- Added regression coverage for minimum acceptance/rejection and maximum-length rejection.
- Did not add a public HTTP endpoint or claim that rate limiting is implemented; the service remains internal until the remaining transport boundaries are concrete.
- Commits: 3560273938653899a70bae9c7fb71a9d473eae95, b4ca231cdb67f7ed090b40b54c56a85ef77b035c, 38da10a67aa0958bc65983cfbde398db490dc13f.


## Registration normalization and policy transport groundwork — IMPLEMENTED, CI PENDING
- Inspected existing Fastify/Nest HTTP setup and found global API error filtering but no established throttling dependency or reusable request-rate-limit boundary.
- Added conservative email provider-subject normalization: trim outer whitespace, preserve local-part case, lowercase domain, reject blank/malformed/whitespace-containing or oversized values; avoided provider-specific transformations.
- Added focused normalization tests.
- Registered the existing MinimumPasswordPolicy behind the PasswordPolicy abstraction in AppModule so transport code can depend on the policy contract.
- Did not expose a registration controller yet because rate limiting remains an explicit REQ-SAFE-006 prerequisite and duplicate-response semantics must be chosen alongside the transport boundary.
- Commits: 90ea68ca397dd4a98619b52aa396385e6ea76ef8, f2b0c406788a8b4a490891164cfad8b40935ceb1, 7a1b52d8eb9fdd70fd5827d04c39ab8ee918f2b0.


## Reusable request rate-limit boundary — IMPLEMENTED (local/single-process), CI PENDING
- Added RequestRateLimiter abstraction returning allow/remaining/retry-after decisions without coupling the limiter to HTTP or authentication.
- Added InMemoryRequestRateLimiter and regression coverage for exhaustion, expiry and key isolation.
- Registered the limiter behind its abstraction in AppModule.
- Added REQUEST_RATE_LIMIT_BOUNDARY.md explicitly documenting that the in-memory adapter is local/single-process only and must be replaced by shared storage for distributed production abuse prevention.
- Registration transport can now enforce a limiter before password hashing or database writes, but public exposure still requires duplicate-safe response mapping and controller-level integration.
- Commits: f704415e2d951f3fa5e76eac76091b8c2e14ccb6, 93d2dc05ed73d7879ae24249591ba31d7c2165e6, 27b1313e013a6aec718518acecf6459f8e033113, 9fe55cb90035885f5dcf14691a1bef356769dbed, 3c7a03a65449fb9b22dbe0e44d3329448dbe969e.


## Registration duplicate-safe transport boundary — IMPLEMENTED, CI PENDING
- Added DuplicateAuthenticationIdentityError and mapped Prisma P2002 uniqueness failures from the atomic registration repository to the stable application error.
- Added PasswordRegistrationTransportService integrating rate limiting before validation/hashing, conservative email normalization, PasswordPolicy validation and generic invalid-input responses.
- Duplicate identity submissions are intentionally transport-indistinguishable from successful submission to reduce account enumeration at this boundary.
- Added focused tests for rate-limit ordering, generic invalid input rejection, normalization and duplicate-safe completion.
- Registered the transport service in AppModule.
- Public HTTP controller is still deferred; request-body DTO shape, privacy-conscious rate-limit key derivation and response status contract must be defined without leaking duplicate identity state.
- Commits: ee6c9a5ede005bcf3f1d5c4b84ed67a63973fb3d, 2ef3e974b4b972ad6dfa154eeae42e16125fffee, 6ece751401b5a8b71871d8c5f2f5b35fa8ed83a6, b1a849271412133a42199f9bb47579c577e968a8, 4019d35910179a724a0dbd1dc0d3469888243a27, 115931dd7bda9b0ead580d321a569f94ec188abe.


## Public password registration HTTP boundary — IMPLEMENTED, CI PENDING
- Added POST /auth/register with 202 Accepted and no account identifier in the response.
- Controller accepts only string email/password values and converts other shapes to generic invalid transport input.
- Added privacy-conscious registration rate-limit key derivation by hashing Fastify's resolved request.ip; the raw address is not embedded in limiter keys and arbitrary forwarded headers are not parsed directly.
- Added controller regression coverage and exposed the controller through AppModule.
- Documented duplicate-safe response semantics, generic invalid input handling, rate-limit ordering and the process-local limiter production limitation in PUBLIC_PASSWORD_REGISTRATION_CONTRACT.md.
- Commits: 06709755845102e0ec4eb495c1c473be9c6caf24, a1cdd48fb10e49bf1bf2ccc328fc7ca385c6ded1, 0c68cad25ed1a56fc535593e270bd7844cf2c7ee, f644b75b651bac9e9a3ab34242eaaad14d3d2e1d, 85461b4a83d2431fead6026b093e10f8b94e3f7b.


## Password sign-in credential verification boundary — IMPLEMENTED, CI PENDING
- Reviewed workspace scripts and current auth repositories; full local CI execution is not available through the repository connector, so no false green claim was made.
- Fixed a formatting defect in PrismaPasswordRegistrationRepository discovered during integration review.
- Added PasswordSignInService with conservative email normalization, provider identity lookup, active identity/credential checks and PasswordHasher.verify against the stored opaque hash.
- Sign-in returns a stable authenticated/rejected result and does not expose whether rejection came from unknown identity, disabled credential or incorrect password.
- Added regression coverage for success, unknown identity without hash verification, disabled credential without hash verification and malformed email short-circuiting.
- Registered PasswordSignInService in AppModule. Session issuance remains deliberately separate from credential verification.
- Commits: 04fb711363a6ae4a9b4615c999bc5f95b70eb9d3, c9110cb9e12c92f31042a34788a80cafe05593b7, 13935d8e14165e25eed0f8095efe12e9638fe153, 65f674462982b5fda21bb4b806745c2c7897d0e7.


## Session issuance application boundary — IMPLEMENTED, persistence deferred
- Inspected existing RequestAuthenticationAdapter and RequestPrincipal contracts and confirmed the application currently has only AnonymousAuthenticationAdapter; no session persistence or token representation exists.
- Added SessionRepository contract and SessionIssuanceService with a bounded seven-day expiry.
- Added regression coverage for deterministic expiry calculation.
- Documented strict separation between password credential verification and session issuance in SESSION_ISSUANCE_BOUNDARY.md.
- Intentionally did not invent a JWT/cookie/bearer format or claim request authentication is implemented; session persistence, revocation semantics and resolver adapter must be designed together.
- Commits: 31e49508fa0b33327a6221c3b00fcc567c81d73a, 65f539a37325ee14326abd82b424e604b94a0160, 8b131ac864b7e4d444c17742b17042720849ec48, f363656f8664999e78900011035b36f6683810de.


## Persistent session and revocation semantics — IMPLEMENTED, migration/CI pending
- Located the Prisma schema and existing RequestPrincipal contract; confirmed sessionId is already a supported principal field.
- Added AuthenticationSession persistence model with account relation, expiry, nullable revocation timestamp and indexes for account/expiry lookup.
- Extended SessionRepository with explicit revocation and added PrismaSessionRepository persistence adapter.
- Added SessionRevocationService and wired session repository/issuance/revocation providers in AppModule.
- Defined usable-session semantics as not revoked and not expired in PERSISTENT_SESSION_SEMANTICS.md.
- Intentionally did not add a bearer secret/token yet; raw credential presentation must be designed so the database never stores a reusable raw secret and revocation remains enforceable.
- Commits: 3576ba38e241750d1242116e0a23d86123b93cb3, 505a5cc9682ce7bcad454aaff328531b1f026850, 1fd0fc9e70a6e525576485b2aafdca8d4cbe9724, 0a8d6d80b71eaf225f969f6cc86a35b3d1033e6d, f97c516c4588efff70b8cebca1c5fb4eaa96f066, 11bca8c83f13944491d898720593c5c82392a438, 2ed8a6977fb2688c5dcb3ae3a2772348245aeba6.


## Opaque session credential and request authentication — IMPLEMENTED, migration/CI pending
- Extended AuthenticationSession with a unique credentialHash and added opaque 32-byte credential generation; only the SHA-256 hash is persisted.
- Extended SessionRepository/PrismaSessionRepository with credential-hash lookup.
- SessionIssuanceService now returns the raw credential once while persisting only its hash.
- Added OpaqueSessionAuthenticationAdapter parsing Bearer credentials, hashing for lookup, and rejecting missing, revoked or expired sessions before producing RequestPrincipal.
- Added regression coverage for active session resolution and missing/revoked/expired rejection.
- Switched RequestAuthenticationAdapter DI binding from anonymous-only to the opaque session adapter.
- Prisma migration directory was absent in the repository; schema changes are recorded but an actual generated migration remains required before deployment.
- Commits: 3ffb38f77d7867afc055bba293f7cbf12c9c02d7, 22d1e625410a97fc43d1108608269d5f42574166, 83198fd301eb5aa05e75a69db27be8b6d6b10d3b, 728f5d479d38a9dae1aad1d08bc547a0df0e78bf, 80721e2b1af9ad9467a53ba0dd897b25de24ed0c, c725991a2fc436fe0ba9e838ecf3e33c6b9c9b0e, 60c875834141c26d8c3dc5509a0524a3aad89834, 5d2d94a65308d7e8366ff2f9493857a9249d6cdc.


## Password sign-in and authenticated sign-out HTTP boundary — IMPLEMENTED, migration/CI pending
- Added PasswordSignInTransportService: rate limiting precedes credential verification and session issuance occurs only after authenticated PasswordSignInService results.
- Added POST /auth/sign-in; rejected credentials return the same HTTP 200 empty object regardless of unknown identity or password mismatch, while success returns the newly issued opaque credential.
- Added POST /auth/sign-out using RequestPrincipalResolver and current authenticated sessionId to persist revocation with HTTP 204.
- Fixed an initial sign-out controller assumption by aligning it with the repository's existing header-based RequestPrincipalResolver pattern rather than introducing a nonexistent decorator/guard.
- Wired both controllers/services into AppModule and documented the public contract in PASSWORD_SIGN_IN_OUT_CONTRACT.md.
- Existing Prisma schema changes still require a generated/applied migration before deployment; connector execution environment cannot honestly claim migration or full CI success.
- Commits: e1a13eaf01ce066188aeb865f13c2cab81d367e0, fc08a3be0d0caebe46cd35a11885122346f7abbd, 00ccd02a5c28543e84f7ea5bfc032d2bf2208d72, ca588f4a8bc596ceb1f29c56cf76630128c67245, bbc266d1b29c3047c8f2ae69f815ffe7e8fd8071, 16706095207c32e147a444aa0918f9a6f95a1e6a.


## Authentication HTTP regression and session lifecycle hardening — IMPLEMENTED, migration/CI pending
- Added controller-level regression coverage for sign-in success credential response, duplicate-safe rejected response, malformed transport input and privacy-preserving rate-limit key.
- Added sign-out controller coverage for authenticated current-session revocation and stable request-id fallback.
- Added SessionRevocationService timestamp regression coverage.
- Corrected PrismaSessionRepository create contract to include credentialHash and changed revocation persistence to updateMany where revokedAt is null, preserving the original revocation timestamp and making repeated revocation idempotent.
- Documented credential lifecycle decisions: independent concurrent sessions are supported; rotation is intentionally deferred until per-session/account-wide/session-family policy is chosen.
- Commits: 53aab8e89f44ac829b027e678da6a25f1b794c99, 83e9e2a5061bfd598f772f29b5179830b78e479b, 15d53d7ed5e24e0472f08df7aee6ac6cf27400a9, 10614f764881f0157ad08dc759b2fe4732c67dab, 627e564120447a3846d5493456f43b2ea21af869.


## Email verification lifecycle boundary — IMPLEMENTED, delivery integration deferred
- Added EmailVerificationToken persistence model with hashed opaque token, expiry and one-time consumption timestamp.
- Added token generation/hash primitives and a 30-minute EmailVerificationService issuance contract.
- Added atomic consume-if-usable persistence semantics to prevent replay of used or expired tokens.
- Added verification flow that activates pending accounts only after successful token consumption and returns a non-enumerating rejected result for unusable tokens.
- Added POST /auth/email-verification returning only verified true/false and regression tests for issuance, activation and rejection behavior.
- Intentionally did not expose raw verification tokens from registration or claim email delivery exists: no outbound mail adapter or trusted verification-link policy is currently present.
- Schema changes require generated/applied Prisma migration before deployment.
- Commits: 2cfc284ee174ed8b1493d52a85165adaa3c2b899, 1f1e8dba3926d1efe2b0864bc7146ce14e840ca6, 50ef49f75b1f287c6539da802497031a13c575a6, ddb1795afebab9173169535837af59379bd6d4c0, e630d082b572016b382178ba03051495abe65b37, 8cd84c4150f32e73832f90d895cb75c9f5ce9ea9, 37dab6335d26a4e0f9c5acfe9b3f8b423a3e9143, 9582c6237dd05c8112eb7b890f9e54d749b62c3d, 07f181cba0c0c4a530a710496189af782c34b8cc.


## Verification delivery abstraction and registration integration — IMPLEMENTED, production provider/retry deferred
- Added OutboundEmailSender abstraction and a safe default no-op infrastructure adapter rather than pretending an external email provider exists.
- Added EmailVerificationUrlPolicy with environment-backed base URL selection and centralized verification-link construction.
- Added EmailVerificationDeliveryService to issue raw one-time tokens and pass them directly to the delivery boundary without exposing them through registration HTTP responses.
- Integrated successful pending password registration with verification issuance/delivery after persistence.
- Added regression coverage for token issuance and trusted link construction.
- Documented production constraints: replace the no-op sender with a real provider, configure trusted HTTPS base URL, and add retry/outbox semantics so delivery failure cannot strand a pending account.
- Commits: b6cc3f89ebc06ed663beac7b3ea93b1235d17f3e, 8c0606c01661dd13c58f536312e4dda19c71fd7a, 9acb14aa52a8ce42b620ce593452e63a94e535ba, 218d881801ed8595de8b024d57a8d185ba241a44, eace8d5562f009685e40a4cb9c4b2cb2fc55358f, 4603ec6164ce89d6c8fcec4ef87d48753e26b308, 59d6615748b3b992e910a968a7c520f1c050023a, 5faa7c55e43a70dc4483e70e5b373c6d8d8c4412, 6934d2a2bafe3e6df273b80c6d64053e8b237b4c, 094496640a6643b0731f799c6eeb511ab7ec1bdf, 563224def94c10f5747576f485ea3b8aca5a99d8.


## Durable email outbox and retry boundary — IMPLEMENTED, worker scheduling deferred
- Resumed from the repository's latest verification-delivery checkpoint and avoided reimplementing prior token/link/delivery work.
- Added EmailOutboxMessage persistence model and ordered SQL migration artifact 0005_create_email_outbox_messages.sql.
- Added EmailOutboxRepository and Prisma implementation with atomic PostgreSQL claim semantics using FOR UPDATE SKIP LOCKED.
- Registration now enqueues a verification delivery intent instead of synchronously calling the outbound sender.
- Added EmailOutboxDispatchService: claim → issue verification token → deliver → mark delivered, with bounded exponential-backoff rescheduling on failure.
- Raw verification tokens are deliberately not stored in the outbox; tokens are issued only by the dispatcher immediately before delivery.
- Added dispatcher tests and extended the repository migration sequence regression guard through version 0005.
- Added EMAIL_OUTBOX_RETRY_BOUNDARY.md documenting five-minute stale-lock recovery and the current at-least-once delivery contract.
- No scheduler/queue worker was invented; dispatch remains an explicit application boundary pending infrastructure policy.
- Commits: 10ee4ba297882351af01e43c79733a02a591ce51, c60e97a8148fa44d9c32a0983d6d01c6cf660420, 92a0d11ac42b408109498d250767a99496e0b7d5, 822b2a5ed86bb39cbca3016bc93f9a4263e8402d, 44525c3860e025e560179340c697e76a1797a3b0, 7e1c86a10716802f47e579dc43a678eef7e3dd80, bc8228e3677ea5a4a7d80685e3a041af85020ab4, f5d7d17ee83bcc0f50c9030b1d8fdef69a48265f, e2f053f0674863b5b8ce980626057838024d504f, 07dcffad46e628ca91f371da3c14c0b1cecbbdf9.


## Email outbox worker execution boundary — IMPLEMENTED, infrastructure adapter deferred
- Re-read the persistent repository checkpoint before resuming and did not recreate the already-complete outbox/dispatcher implementation.
- Added EmailOutboxWorker as an explicit execution boundary around EmailOutboxDispatchService.
- Supports runOnce() and bounded drain(maxMessages), stopping on empty queue or configured bound.
- Added focused worker regression tests for one-shot execution, bounded drain and empty-queue termination.
- Registered the worker in Nest DI without starting any timer or background loop from AppModule.
- Added EMAIL_OUTBOX_WORKER_BOUNDARY.md documenting why process scheduling remains infrastructure-owned and replaceable.
- Commits: a94973a413c7dadfb19e253a01f8f2d98421ba67, 8410700e44c880b22ce10bd8864b42dfed606400, 493f46ee0bae59b643e28ac86502c39f3eacc4ef, 1b198ebd0e2fbdec86a8b3bf364ef6e99fdf2b48.
- CI state: not yet verified in this session; do not infer green until workflow evidence is recorded.


## Standalone email outbox process adapter — IMPLEMENTED, CI evidence pending
- Re-read the persistent checkpoint and verified no workflow runs were returned for the prior durable-outbox and worker-boundary commit SHAs; status remains unverified rather than assumed green.
- Inspected committed topology: HTTP API bootstrap exists, local PostgreSQL/Redis infrastructure exists, but no queue framework or scheduler/process supervisor is committed.
- Chose the smallest grounded adapter: a standalone Nest application context that drains one bounded outbox batch and exits.
- Added EmailOutboxProcessService with structured completion telemetry (processed count and duration).
- Added apps/api/src/email-outbox-worker.main.ts with EMAIL_OUTBOX_BATCH_SIZE validation (1..1000) and guaranteed application-context shutdown.
- Added explicit pnpm email-outbox:run command using tsx; no AppModule timer or HTTP-process background loop was introduced.
- Added focused process-service regression coverage and EMAIL_OUTBOX_PROCESS_ADAPTER.md operational contract.
- Commits: 78e84c0c51df4193bddc4ffccc5f0b692e6525bd, 523b325ffd91a16041cfb9887b30ed50615613b2, c99321fb38a05f9d8662a70b9d0c03bd8d3fa823, 7606b053c1740cca5c29302a918497440b99e9a0, 4293fee2b103623e534290d31ef24c6aea0ec0b0, 4b17c42d99381b2440fba7fda717bfa984c734c0.
- CI state: workflow evidence for these commits and preceding outbox commits is not available through the current connector response; do not infer green.


## Outbound email identity and failure observability — IMPLEMENTED, provider selection deferred
- Resumed from the persistent exact-next-action checkpoint and did not recreate the existing outbox/process implementation.
- Extended OutboundEmail with required stable messageId; the durable EmailOutboxMessage.id is propagated through dispatch and verification delivery unchanged across retries.
- Added a provider-neutral failure classification boundary: transient, permanent and unknown, with explicit handling for 429 and 5xx responses.
- Dispatcher records classification-prefixed, bounded failure information without persisting provider response bodies, credentials or raw verification tokens.
- Added focused regression coverage for message identity propagation and failure classification.
- Added OUTBOUND_EMAIL_IDENTITY_OBSERVABILITY.md defining the correlation/idempotency contract and explicitly deferring provider-specific behavior until a provider is selected.
- Commits: 2b35ce79af8228317eeaf51d8c0529bfc273feda, 8e1fe791fd97c02251a62dd1298510ccf22bc331, 157601dba5b88b5656ddf342ae35b03d9da2269d, fc13ccda8344330e2040eee97d69fb534aa532b3, 29d76a3a444e0e0c6da1f7511a07a296d733277f, 60fdad8e33756c0338fe3cf6a4df7d5ab534839e, eefc849d02dfe0493299e9792ea46d4abb9d1196, 9b1508463841c2468a94abeeffd431608bc561d2.
- CI state remains unverified through the current connector; do not infer green.


## Email outbox terminal failure policy — IMPLEMENTED, CI evidence pending
- Resumed from the persistent exact-next-action checkpoint and did not recreate completed verification, outbox, worker, process or identity work.
- Added explicit terminal EmailOutboxMessage status 'failed' and failedAt persistence field.
- Added ordered migration 0006_add_email_outbox_terminal_failure.sql and extended the committed migration sequence regression guard through version 0006.
- Added EmailOutboxRepository.markFailed() and Prisma terminal-state persistence that clears worker locks and bounds stored error text.
- Dispatcher now transitions classified permanent failures directly to 'failed' without rescheduling; transient and unknown failures retain bounded exponential backoff.
- Added regression coverage proving a 422-style permanent provider failure calls markFailed and never calls reschedule.
- Added EMAIL_OUTBOX_TERMINAL_FAILURE_POLICY.md documenting the terminal state, operational review boundary and explicit non-adoption of an invented external DLQ.
- Commits: 0fc2bce7a88c47c02b8c6f2077be9c0ee92143fa, 3cc7defdce792d80703b68c0784b2b160b248be1, d0b328a4012189e24a010e2883b7f15cc923009d, 62cc644abb1080dd61f6a424d7cde33b0158edc7, 9d0f7ffe341b9df43f3872d4bad6a23eeb9985b7, bc37d75c70dbed1704d1157559e4d26a6594ff34, 53f70e36b83b710db9d296138c29cbca5e45004d, 0ac443f1086fbfa7cf1f5d5e0342eaee7ee88215.
- CI state: recent outbox/process/identity/terminal-failure workflow evidence remains unavailable through the current connector; do not infer green.


## Failed email outbox review and manual requeue — IMPLEMENTED, CI evidence pending
- Resumed from the persistent exact-next-action checkpoint and did not recreate completed outbox, retry, worker, identity or terminal-failure work.
- Added a dedicated FailedEmailOutboxRepository review boundary rather than expanding the delivery repository with operator concerns.
- Added Prisma implementation for bounded failed-message listing and status-qualified requeue transitions.
- Requeue succeeds only when the row is still status='failed', preventing a stale operator action from overwriting a concurrent state transition.
- Requeue preserves the durable message ID for provider correlation while clearing terminal failure metadata and making the message immediately claimable.
- Added FailedEmailOutboxReviewService with bounded list limits (1..100) and explicit manual requeue operation.
- Added focused review-service tests and registered the new boundary through Nest DI.
- Added FAILED_EMAIL_OUTBOX_REVIEW_REQUEUE.md documenting why no public administrative HTTP endpoint was invented without grounded operator authorization/audit requirements.
- Commits: 5fa7da9113cf021b475913e138b667056b7011a3, a5328aa5cad49f2af06ff90dff0d2dbed82db6bd, 07f9f77de333d13baf45eb28877bcfb2f69de9f9, 11932057acea4f80a030ae01dc8e747b4d28997c, 26a5e6ddbfe5493c31fdbd1ecb0fce76589bd75e, 5cc65193b6eb47ba677a7cba63a8fe0f2b4fba13.
- CI state: recent outbox/process/identity/terminal/review commits remain unverified through the current connector; do not infer green.


## Outbound provider and administrative integration investigation — COMPLETE, provider/admin implementation intentionally deferred
- Resumed from the persistent exact-next-action checkpoint and verified the current application binding still uses LoggingOutboundEmailSender with no external delivery.
- Inspected API dependencies: no email provider SDK is committed and no email-provider credential environment convention exists.
- Inspected architecture and decisions: external messaging providers are explicitly replaceable and production provider selection remains a deployment adapter decision.
- Added OUTBOUND_EMAIL_PROVIDER_SELECTION.md defining grounded selection criteria and an integration sequence; no provider, credentials or network delivery were invented.
- Inspected existing authenticated operations and confirmed RequestPrincipalResolver/opaque sessions exist, but no persisted administrator role model, operator authorization service or audit persistence boundary exists.
- Added ADMINISTRATIVE_FAILED_OUTBOX_INTEGRATION_BOUNDARY.md documenting why failed-message review/requeue must remain an application boundary until authentication + authorization + audit foundations can be reused.
- Commits: 708ac14023c9a96d39fcb9ac225b6f181a3c0fcc, 2b051d253d7d049dfe1419fc47d2462321bab12e.
- CI state: recent outbox/process/identity/terminal/review/provider-boundary commits remain unverified through the current connector; do not infer green.


## Administration role foundation — IMPLEMENTED, CI evidence pending
- Resumed from the persistent exact-next-action checkpoint and did not expose failed-email operations publicly before an administration foundation exists.
- Traced DOMAIN_MODEL.md and DATA_MODEL_DRAFT.md: Administration/Audit owns roles, operational scopes and append-oriented audit records; role assignments require effective periods and assigning authority.
- Added provider-neutral AdministrativeRoleKey vocabulary (moderator, administrator, auditor) and deterministic active-assignment lifecycle evaluation.
- Added focused domain tests covering stable keys plus effective, expired and revoked assignments.
- Added ordered migration 0007_create_administration_roles.sql with roles and role_assignments, effective-period constraints, assigning-authority reference and authorization-oriented indexes.
- Added Prisma mappings and Account relations for role assignments without introducing an HTTP administration surface.
- Extended the repository-owned migration sequence regression guard through version 0007.
- Commits: 8beab90e120630e7b8960af2f28a0aaf2f8ea87e, 3a7b75af093b7c7d1ae1d6ec2e0b948df07110e0, 8ed340a6269c8a27c901f0a27c5921a784abf577, 23baf7ceb3c6516b2c1e48d67d39b14fcaebde32, 31bd22507fce7f0a6d358c0a0af56eb0cfecc5a3, ddfb73f5e4fc042aeb85b70035631bb07adc68b9.
- CI state: workflow evidence for this slice and preceding outbox/provider-boundary commits remains unavailable through the current connector; do not infer green.


## Administrative authorization read boundary — IMPLEMENTED, CI evidence pending
- Resumed from the exact checkpoint and followed dependency order: role persistence now has an authoritative read path before any privileged endpoint or mutation surface is introduced.
- Added RoleAssignmentRepository.findActiveForAccount(accountId, now) as the narrow authorization input boundary.
- Added PrismaRoleAssignmentRepository filtering by effectiveAt, expiry and revocation in the authoritative query, with deterministic ordering.
- Added AdministrativeRoleAccessService for explicit hasRole/hasAnyRole evaluation; authentication alone remains insufficient for privilege.
- Added focused tests for positive/negative role checks and explicit multi-role checks.
- Registered the repository and access service through Nest DI.
- Added ADMINISTRATIVE_AUTHORIZATION_READ_BOUNDARY.md documenting the request principal → active assignment → explicit capability path and deferring mutation/endpoints until audit persistence exists.
- Commits: b25d985532351e3179f75f1c9b26469d0e3b1059, 51951c23f06d595887b3122d74ac5b96f7094cf9, 9dad8a1064cd51b0d1e923c05ea224504e9f77dc, 9d27a478b39efdcfe22345d719da0e9d6f167b0b, c9c44bd74ef35fe5cb1111304404dd8f3e88c845, 0e271e3e26ad01207ff22ba17d8bf96251a37654.
- CI state: workflow evidence for this slice and preceding administration/outbox commits remains unavailable through the current connector; do not infer green.


## Append-oriented audit persistence — IMPLEMENTED, CI evidence pending
- Resumed from the exact checkpoint and implemented the smallest audit dependency before exposing role mutation or privileged operations.
- Reused the existing AuditRecord domain contract and Administration/Audit ownership rather than inventing a parallel event model.
- Added AuditRecordRepository with append-only persistence semantics; no update/delete methods exist on the boundary.
- Added PrismaAuditRecordRepository and AuditRecordService with domain validation before persistence.
- Added migration 0008_create_audit_records.sql with actor/action/target chronological indexes and minimal metadata fields.
- Added Prisma AuditRecord mapping and Account relation, plus Nest DI registration.
- Added focused tests proving valid data-minimized append behavior and invalid records are rejected before persistence.
- Added APPEND_ORIENTED_AUDIT_PERSISTENCE.md explicitly excluding raw credentials, verification tokens, message bodies and unrestricted request payload copies.
- Commits: 1cef289046e743f60f3738fac3e401d80ec55a81, bfd7e082d729d6e4d96838f78164eaee1f1c3484, fc5ce534ba79e3acbf920799dcda4bd0c7901d49, 10640606c7b9a78b6761d225e81f815ef861e444, 219bff07e3e3d1d25e484667d8d26e4d14ddfe5e, 78b3f8c1e795433f90cf54d9c4d47a8735c6188b, d6216cf11facc199104cdb0d9af837e8e980baad, 294cec83f84abacd9851b737f45c2eeed5d43744, 31846533ca31a324c243177384ca88a4f2f21939.
- CI state: this audit slice is not yet validated through CI evidence available to the current connector; do not infer green.


## Audited administrative role mutation boundary — IMPLEMENTED, CI evidence pending
- Resumed from the exact checkpoint and used the completed role read + audit persistence dependencies without reopening unrelated work.
- Extended RoleAssignmentRepository with explicit assign() and lifecycle-qualified revokeActive() operations.
- Prisma assignment persists assigning authority and upserts only stable role vocabulary entries; no role value is taken from request-time privilege claims.
- Revocation updates only currently active assignments at the mutation time and returns the number of transitioned records.
- Added RoleAssignmentMutationService requiring explicit actor identity, validating effective/expiry windows and appending data-minimized audit records after successful mutation.
- No revocation audit record is written when no active assignment changed, preventing false-positive operational history.
- Added focused tests for assigning authority + audit, no-op revocation and invalid time windows.
- Registered mutation service through Nest DI and documented AUDITED_ROLE_ASSIGNMENT_MUTATION_BOUNDARY.md.
- Commits: 8ede382b3e2147229394dd50aa6d3b41680d9dc2, 15d6146ff73bc0afcea2808d789af40dcba5bcac, c53a1c7d32b130c471fc4072a3ba1e5bc9948542, 15c193dd8b53c2ee65dff454dd2c4eca116069ba, f8022ea71068af9f4be27f82637a3a15660c03bb, bce0c1b795d11e7db159deab376c9a7ca5ca8181.
- CI state: this mutation slice remains unverified by CI evidence available through the current connector; do not infer green.


## Administrative capability policy and authorized role management — IMPLEMENTED, CI evidence pending
- Resumed from the exact checkpoint and added the missing policy composition instead of introducing an administrative HTTP transport prematurely.
- Added AdministrativeCapability vocabulary and a centralized role-to-capability policy: administrator manages administrative roles; moderator/administrator may review failed email outbox operations.
- Added AdministrativeCapabilityAccessService with explicit can()/require() decisions backed by authoritative persisted active-role evaluation.
- Added AdministrativeRoleManagementService that enforces capability authorization before delegating to the existing audited mutation service.
- Added focused tests proving policy role selection, forbidden capability rejection, authorization-before-mutation ordering and no mutation after authorization failure.
- Registered capability access and authorized role management through Nest DI.
- Added ADMINISTRATIVE_CAPABILITY_POLICY.md documenting the policy and reusable composition for failed-email operations.
- Commits: adeed9e6165b7d44c1f828e18e6cd1c316a1f334, 97a41c23a79310e73e80ac25050b8a0093cefcb1, c910b30f8c01ddefc7f453c323ce129622f40e71, 2c0698375d87be0f05fcaa1690f36c87df604de6, 8763779f7c653aff21d12c3b93e5c03362b4979b, 3a9c2e4cdd660d12430040668f593eedb80669be, e2e7ad3154ed14d9d77058a1f96b8a3bd442848b.
- CI state: this slice remains unverified by CI evidence available through the current connector; do not infer green.


## Privileged failed-email outbox application boundary — IMPLEMENTED, CI evidence pending
- Resumed from the exact checkpoint and found the failed-email review service under apps/api/src/auth rather than recreating a parallel email module.
- Added PrivilegedFailedEmailOutboxService as the composition boundary around the existing FailedEmailOutboxReviewService.
- Both list and requeue require the existing review-failed-email-outbox administrative capability before accessing the outbox.
- Successful privileged review appends a minimal audit record without copying message bodies or email contents.
- Successful guarded requeue appends a target-correlated audit record; no-op requeues do not create false-positive audit history.
- Added focused ordering tests for authorize → operation → audit, authorization failure preventing both operation/audit, and successful vs no-op requeue audit behavior.
- Registered the composed service through Nest DI and added PRIVILEGED_FAILED_EMAIL_OUTBOX_BOUNDARY.md.
- Commits: b36bee213ba5fa10b2d3d0c24362e61d12cc925f, 0ac1c076839cca7646d7b048cbac5c8ea5551214, 4e33a3b1a9eb98546c9682f2a4152cd4a17ec29e, 7a02f4cc1d22d4df6487445d2d7c29643f22db33.
- CI state: this composition slice remains unverified by CI evidence available through the current connector; do not infer green.


## Administrative failed-email outbox HTTP transport — IMPLEMENTED, CI evidence pending
- Resumed from the exact checkpoint and traced the existing authenticated-controller convention instead of inventing guards or a parallel authentication mechanism.
- Reused RequestPrincipalResolver.requireAuthenticated with Authorization and x-request-id headers, matching existing authenticated account/capability controllers.
- Added the smallest transport surface: GET /administration/failed-email-outbox with a 1..100 bounded limit, and POST /administration/failed-email-outbox/:id/requeue.
- Controller passes only principal.accountId and validated transport input into PrivilegedFailedEmailOutboxService; it does not access repositories, perform role checks or write audit records.
- Added focused controller tests for principal resolution before privileged access, invalid limit rejection before outbox access, and minimal identity/target forwarding for requeue.
- Registered the controller and documented ADMINISTRATIVE_FAILED_EMAIL_OUTBOX_TRANSPORT.md.
- Commits: 73bdfcbf6cdbd053390ec0d3f8ead406837fba6c, 0a60394ad43fe4e22094fce0d95006de6fe12e1b, a1bcfa20d15b2458cf2a91cccc88648a7bda338b, 47ee3efa08cdc5e67760a89c8f066adfaf626488.
- CI state: this transport slice remains unverified by CI evidence available through the current connector; do not infer green.


## Initial administrator provisioning boundary — IMPLEMENTED, CI evidence pending
- Resumed from the exact checkpoint and resolved bootstrap before exposing runtime role-management HTTP routes.
- Confirmed no existing bootstrap/config convention could be safely reused; deliberately avoided an unauthenticated bootstrap endpoint or self-escalation path.
- Added InitialAdministratorProvisioningService as a dedicated deployment/operator boundary, separate from runtime AdministrativeRoleManagementService.
- Provisioning accepts an explicit pre-existing account ID, creates administrator only when none is already active for that account, and is idempotent for repeated operator invocation.
- Bootstrap assignments intentionally have no invented human assigning actor; assignedByAccountId is optional at the repository boundary to match the nullable persistence model, while ordinary runtime mutation still supplies the authenticated actor.
- Added focused tests for first provisioning and idempotent repeated invocation.
- Registered the provisioning service through Nest DI but deliberately exposed no public HTTP route.
- Added INITIAL_ADMINISTRATOR_PROVISIONING_BOUNDARY.md documenting deployment-time-only semantics and prohibitions.
- Commits: d42af0176b9df78292c66bce5cc5e65b192a06f5, a51b827671beabe2e185baa69287bac06d52300a, 1bfb628179e565b3126864307f8cd2912fc4577f, 850c81abe56cd71a42a3148a04493d5cf86d33d0, 88a1c5ff90264c1e6153cb29b2311222a37d5e94, ebce999936a6345a242f8a2dac36e6536a15934d.
- CI state: this bootstrap slice remains unverified by CI evidence available through the current connector; do not infer green.


## Administrative role management HTTP transport — IMPLEMENTED, CI PENDING
- Resumed from the exact checkpoint after separating initial administrator provisioning from runtime transport.
- Added AdministrativeRoleManagementController following the existing RequestPrincipalResolver authenticated-controller convention.
- Added POST /administration/roles/accounts/:accountId/assign and POST /administration/roles/accounts/:accountId/:role/revoke.
- Transport validates non-empty target account IDs, closed administrative role vocabulary, optional ISO timestamps and effective/expiry ordering before mutation.
- Controller forwards only authenticated actor identity and validated input to AdministrativeRoleManagementService; no direct repository access, capability checks or audit writes were added to transport.
- Bootstrap provisioning remains intentionally outside HTTP role management.
- Added focused controller tests for authenticated principal forwarding, invalid role/time-window rejection before mutation, and revocation target forwarding.
- Registered controller through Nest DI and documented ADMINISTRATIVE_ROLE_MANAGEMENT_TRANSPORT.md.
- Commits: 75bbdfd62cc8b7398591ccfa59f10b95014793cd, 935cc81a5887edd79fe922db6b444dc7d1df9b93, 7f92eff2ee67a2efd509a028599c2dd55ba6bc90, 1a847b1e85c2a436aead28d3ef1eded57ecad70f.
- CI state: implementation committed; validation evidence pending. Do not infer green until workflow results are inspected.


## Administrative role management HTTP integration coverage — IMPLEMENTED, CI PENDING
- Resumed from the exact administrative role-management transport checkpoint and added the next validation layer rather than expanding unrelated functionality.
- Added real Nest/Fastify HTTP integration coverage around AdministrativeRoleManagementController and ApiErrorFilter.
- Verified authentication failure returns 401 before role mutation invocation.
- Verified application capability denial propagates as 403 with the request correlation ID and is never converted into a successful mutation response.
- Verified HTTP success is emitted only after the authorized application mutation resolves and forwards the authenticated actor/target/role correctly.
- Tests intentionally replace authentication and application collaborators while using the real HTTP controller/error boundary, avoiding a brittle duplicate of persistence and audit implementation already covered at lower layers.
- Added ADMINISTRATIVE_ROLE_MANAGEMENT_HTTP_INTEGRATION.md documenting the validation boundary.
- Commits: 1e7b3f72aeea91f2e7cbcf3082952bad03fc2bd5, cd31007b6c7bc9be0810c9e97a8bf8b3374d123b.
- CI state: implementation committed; workflow validation for this latest slice is pending and must not be inferred from earlier green runs.


## Initial administrator provisioning command — IMPLEMENTED, CI PENDING
- Resumed from the exact checkpoint and inspected executable process conventions instead of inventing a public bootstrap transport.
- Found the grounded repository pattern in email-outbox-worker.main.ts: explicit Nest application context entrypoint, no HTTP listener, deterministic argument/config validation and guaranteed context shutdown.
- Added initial-administrator-provisioning.main.ts following that pattern and registered pnpm command administrator:provision.
- Command accepts exactly one explicit non-empty account ID and invokes InitialAdministratorProvisioningService; repeated invocation reports the service's idempotent no-change result.
- Added focused command argument tests and documentation in INITIAL_ADMINISTRATOR_PROVISIONING_COMMAND.md.
- No unauthenticated HTTP route, self-registration path or caller-controlled privilege claim was introduced.
- Commits: 38be38b728a6cac5bd0762dd55596ff601d9d0ba, a7d3a884126591d5d70fe59950a1e624ae8ef762, 87cee55b8ad3bdadafcb547fa4f440f454e87fc6, 9fcf52d6d4d86687b44d04850cc3ea1126f3b436, 9b04222b8855359818d68a9ee1bc0c4453e6fd5c.
- CI state: implementation committed; validation evidence pending. Do not infer green.


## Administrative audit correlation propagation — IMPLEMENTED, CI PENDING
- Resumed from the exact checkpoint and traced the existing optional AuditRecord correlationId rather than widening audit storage.
- Added a single optional correlationId through privileged application/mutation inputs for administrative role mutation and failed-email review/requeue.
- HTTP controllers forward only a trimmed request correlation value; application services and audit persistence remain HTTP-independent.
- Correlation is attached only at existing successful-operation audit points; authorization failures and no-op mutations do not create correlation-only audit records.
- Operator/non-HTTP invocation remains correlation-free by default and does not synthesize request metadata.
- Explicitly excluded request bodies, credentials, authorization headers, email content, provider payloads and arbitrary headers.
- Added focused tests for successful propagation and absence on non-HTTP invocation.
- Added ADMINISTRATIVE_AUDIT_CORRELATION.md.
- Commits: 1b81e269b601c1fb876221098d0c1558f64e660d, 32e587240d6aa3b1de8702851ab2ee81556ce38c, 857f499accf91adbe925da832b4ed47df599971a, 4efd9193548163da31f2bdd5c6694645ac7702e2, ffc49c07a49df099f04fc958650fbe821b083fed, 0bb4a2b748b88064c7c9ee72e59a91728df638e6, e59c771368448b90f5d0ecef098059ce4b8b0282.
- CI state: implementation committed; validation evidence pending. Do not infer green.


## HTTP correlation convention reconciliation — IMPLEMENTED, CI PENDING
- Resumed from the exact checkpoint and inspected the shared HTTP boundary before changing privileged controllers.
- Confirmed the repository-wide canonical header is observability.CORRELATION_ID_HEADER = x-correlation-id.
- configureHttpApplication() resolves and returns x-correlation-id on every HTTP request; ApiErrorFilter uses the same convention for errors.
- Corrected administrative role and failed-email transports away from their parallel x-request-id convention to x-correlation-id.
- Privileged transports still pass an internal request label to authentication when no canonical correlation value exists; this label is not audit correlation metadata.
- Extended HTTP integration coverage to assert canonical correlation propagation into the role-management application input.
- Added HTTP_CORRELATION_CONVENTION.md so future transports consume the shared convention instead of redefining header names.
- Commits: ab1d219ee6f0cd0c173498437748554d739d6ed3, 5fd3a23ebce9758e8a32210316b17a34418fcdf9, 83d22313ff50074ffa62b73a55183a48ffa9269a, ec6b573ac215a232511495bf27463daa8c299b10.
- CI state: implementation committed; validation evidence pending. Do not infer green.


## Configuration resolution baseline — IMPLEMENTED, CI PENDING
- Resumed from the milestone dependency graph and moved to Milestone 2 rather than expanding completed administrative transport.
- Added a pure typed configuration resolution primitive in the domain package.
- Setting definitions now own typed defaults and explicitly allowed scopes.
- Resolution precedence is deterministic: category-region > category > region > deployment > platform > default.
- More-specific values are ignored when the setting does not permit that scope; explicit validation rejects invalid scope assignments.
- Added focused tests for precedence, fallback/default behavior, scope restrictions and invalid assignments.
- Added CONFIGURATION_RESOLUTION_BASELINE.md to record the boundary and deliberately defer persistence, draft validation, immutable publication, rollback, audit and client projection to subsequent Milestone 2 slices.
- Commits: 3683f748d67d963d87054c66eaab15c12fd87838, cec701aed9be2d90db0ad4fe27a7b78e0d4e647d, 72cfe378b9e86f9089740119de580cb911794d57, b8cfe9e34241514ef0d12a12fbfc92beb662e1d7.
- CI state: implementation committed; validation evidence pending. Do not infer green.


## Configuration version persistence — IMPLEMENTED, CI PENDING
- Resumed from the Milestone 2 checkpoint and inspected the repository-owned ordered SQL migration convention plus Prisma physical schema.
- Added migrations 0009 configuration_versions and 0010 configuration_values after existing version 0008 audit_records.
- Version lifecycle is database constrained: draft, published and superseded with unambiguous publication/supersession timestamps.
- Enforced one current published version per scope with a partial unique index while retaining historical superseded versions.
- Configuration values use typed primitive columns (boolean/integer/decimal/text) with exactly-one-value CHECK constraints; no untyped JSON blob is the primary persistence contract.
- Added exact Prisma mappings for both tables and their relation.
- Runtime precedence remains exclusively in the domain resolver; SQL persistence does not duplicate scope precedence.
- Added CONFIGURATION_VERSION_PERSISTENCE.md and deliberately deferred editing transitions, immutable publication application service, audit integration and rollback/reversion.
- Commits: 3e26b7f46c0d9f9822e4bcd2a332b0b4d6ea5555, 2e0111c12b6e65118223ba66caabdca0d77fe164, f5abc905fb6d3ffea9305ff2a06560881f3aa676, 613eb7fac993998e31fa9b3b6ecefd93aa0fd855.
- CI state: implementation committed; validation evidence pending. Do not infer green.


## Configuration version repository boundary — IMPLEMENTED, CI PENDING
- Resumed from the exact Milestone 2 checkpoint after the version/value persistence schema.
- Added a narrow ConfigurationVersionRepository contract for draft creation/loading and current published-version lookup.
- Added PrismaConfigurationVersionRepository using the typed physical schema without embedding configuration precedence or publication transitions.
- Added focused repository tests for draft creation and status-constrained draft/published lookup.
- Registered the repository through Nest DI.
- Version lifecycle transitions remain deliberately outside the repository so immutable publication can own atomic state changes as an application transaction.
- Commits: 94630c5c061f9da7fe479c841f456f7b1a393844, aad2e9e309b1a7e1c6e3be08f240d70596cdbbf1, 86d751b840486690505d319cd65896eb9489f529, 6d8273097853ae4460f2baf48d6df7e17f3e2d1f.
- CI state: implementation committed; validation evidence pending. Do not infer green.


## Immutable configuration publication transaction — IMPLEMENTED, CI PENDING
- Resumed from the exact repository checkpoint and used DatabaseService's Prisma interactive transaction convention rather than inventing a separate transaction abstraction.
- Added ConfigurationPublicationService as the application lifecycle boundary; repository access remains read/create oriented.
- Publication first resolves the selected record as a draft, then runs one interactive transaction.
- Within that transaction, any current published version for the same scope is transitioned to superseded and the selected draft is conditionally transitioned to published.
- Conditional draft update count is checked so a concurrent/non-draft transition cannot be reported as successful publication.
- No-current-published publication is supported; missing drafts fail before a transaction opens; transaction failures propagate without a success result.
- Added focused tests for normal replacement, first publication, missing draft and transaction failure.
- Registered ConfigurationPublicationService through Nest DI and added CONFIGURATION_PUBLICATION_TRANSACTION.md.
- Commits: 798ee13c359acb79306967ffd6869927bbf34817, 6c5520227c6b3407c820a8f36be94ed2bbc1d5a3, de6ca8ca34ff21de9439c2851908058cf5193dd6, 2b014bdb72001b9141712c175f766246a602401a.
- CI state: implementation committed; validation evidence pending. Do not infer green.


## Configuration draft validation boundary — IMPLEMENTED, CI PENDING
- Resumed from immutable publication and added the missing product-level validation primitive before allowing further draft editing/persistence expansion.
- Added ConfigurationSettingDefinition with authoritative key, primitive type and allowed scopes.
- Added DraftConfigurationValue validation that rejects setting-key mismatch, declared type mismatch, disallowed scope and runtime values incompatible with the primitive type.
- Kept physical storage constraints and product-level validation complementary: database protects typed columns; domain definitions protect setting meaning.
- Added focused tests for accepted matching values and all principal rejection paths.
- Added CONFIGURATION_DRAFT_VALIDATION.md and explicitly deferred the authoritative application-specific setting registry instead of hard-coding a speculative catalog.
- Exported the new domain contract.
- Commits: 07730bd85a307815f476aef91ea104d4532801f9, b4caef8403029865a941fecffb48dad1792d1729, 35ff9f7cb39ef814053d75ab06e8e09585806a58, 42972c8daf6f9b42816099f1b4eb5a3eb00a7fbd.
- CI state: implementation committed; validation evidence pending. Do not infer green.


## Configuration setting definition provider — IMPLEMENTED, CI PENDING
- Resumed from the exact draft-validation checkpoint and inspected repository conventions; no grounded generic registry abstraction existed, so a narrow configuration-specific provider was introduced rather than inventing a framework-wide registry.
- Added ConfigurationSettingDefinitionProvider with exact-key lookup and an Injectable in-memory implementation.
- Application composition now owns the provider; controllers and persistence repositories do not own setting catalogs.
- The default provider is intentionally empty/fail-closed: unknown settings do not become implicitly valid.
- Added focused exact-key/unknown-setting tests and CONFIGURATION_SETTING_DEFINITION_PROVIDER.md.
- Registered the provider through Nest DI so a future authoritative catalog source can replace the implementation without changing validation callers.
- Commits: f484f3d42394e51431ec2a3caf951233d0a49f78, bc0935ff119213994b7d1fad7e276d5abac459c8, 362260d75c28760727706eb1f41f6fc12cf344ad, 6b2b9fefbd3883a12473cfe483d5e25188316c51, b3570addbb0086f0fbc720ae0a893389e7ea075d.
- CI state: implementation committed; validation evidence pending. Do not infer green.


## Validated configuration draft editing — IMPLEMENTED, CI PENDING
- Resumed from the authoritative definition-provider checkpoint and proceeded directly to the required persistence/editing path without introducing unrelated abstractions.
- Added ConfigurationValueRepository with narrow upsert semantics and Prisma typed-column mapping for boolean, integer, decimal and text values.
- Added ConfigurationDraftEditingService: it loads only an editable draft, resolves the authoritative definition, validates key/type/scope/runtime value, then persists the validated typed value.
- Published and superseded versions are rejected through draft-only lookup before any persistence mutation; unknown settings also fail before mutation.
- Upsert replaces a setting value within the same draft version instead of creating duplicate rows, matching the database uniqueness contract.
- Added focused editing tests and registered the repository/service through Nest DI.
- Commits: c5d7fd19f881162cd857d876df5adde7d59e095f, 49d0ab4a4ef3daff8b486e338f801205137efe30, 872e259b792cdf131ee7595ed1dff5d6585fa962, d8c774b942df4c8e48605f503a29f03ec618c91e, 1d986b91e0320640e31a1c78f345f5f2bd96927f.
- CI state: implementation committed; validation evidence pending. Do not infer green.


## Configuration publication audit integration — IMPLEMENTED, CI PENDING
- Resumed from validated draft editing and integrated only the existing minimal AuditRecordService contract; no new audit schema or parallel audit pipeline was introduced.
- ConfigurationPublicationService now requires an explicit privileged audit context containing actor identity and optional correlation ID.
- Actor identity is supplied by the caller boundary rather than synthesized by configuration persistence.
- Successful publication appends a narrow configuration audit event after the immutable database transaction commits.
- Failed/missing publication paths do not emit a successful-publication audit record.
- Added focused tests for successful correlation propagation and absence of audit on missing/failed publication.
- Added CONFIGURATION_PUBLICATION_AUDIT.md.
- Commits: 9bbbeaf70ff3234fff81d05e476f2bff46e178df, 1594be2c5a1d3ba2b65b6db9317995360bbfd095, 4b5c9e36a91ca8dd50b8518a44f7c9c98af3a7b4.
- CI state: implementation committed; validation evidence pending. Do not infer green.


## Runtime effective configuration projection — IMPLEMENTED, CI PENDING
- Resumed from publication audit integration and added only the required published-value loading/projection path.
- Added ConfigurationEffectiveValueRepository for loading values belonging exclusively to published versions.
- Prisma projection converts the physical typed-column representation back into domain primitive values and fails closed if persisted rows violate the typed-column contract.
- Added ConfigurationEffectiveValueService that delegates all scope precedence to the existing central resolveConfigurationValue() function; no second precedence engine was introduced.
- Domain defaults remain authoritative when no published value exists.
- Added focused tests for central precedence delegation and default fallback.
- Registered effective value repository/service through Nest DI.
- Commits: 1fe1476fb7acfec4ce2241ff3a77600389e617e0, ab75dbeb5fc2a4a8761f525c366dbe9ea41a4378, 3dc2c651d8138b28c790772953378635a82031f1, 472df2dfb74a7aa5a71cbbd3d905df1e72ad0060, 401ffe3b00f7ca73f97702af1ebf699b3b43314f.
- CI state: implementation committed; validation evidence pending. Do not infer green.


## Immutable configuration reversion — IMPLEMENTED, CI PENDING
- Resumed from runtime effective projection and implemented reversion without mutating historical published/superseded versions.
- Reversion selects a historical non-draft version, allocates the next version number, clones immutable typed values into a new draft inside a database transaction, then routes publication through the existing transactional publication service.
- Historical source rows remain unchanged; reversion produces a new version identity and append-only history.
- Added distinct reversion audit action with explicit actor/correlation context.
- Missing/draft historical versions fail before clone/publication mutation.
- Added focused service tests and CONFIGURATION_REVERSION.md; registered the service through Nest DI.
- Commits: 8e46f4a59e8da4cba0fd3c12d708ac82c47b3ea8, 01902f2846d786bd41f5ef22ce9eb5a9fcffa2fe, f1fd6d9fc3db30acf0bbb94f568a58f12e18bfc3, 52eea846a74c8435a7ce49b5d1861d403e2a849a, 0434afdbc2d748811e39c887a359a36c93d4a782, ce8e631aad5aa05d2760ad9d83f1c5abf3e6c4b7.
- CI state: implementation committed; validation evidence pending. Do not infer green.


## Milestone 2 validation review — CI EVIDENCE UNAVAILABLE, ONE CONCRETE TYPE FIX APPLIED
- Resumed from the exact validation checkpoint before adding new functionality.
- Queried workflow evidence for the latest Milestone 2 checkpoint commit; the available GitHub workflow-run endpoint returned no associated runs, so no CI result was inferred.
- Reviewed package validation commands: repository-level Turbo build/typecheck/lint/test and API Prisma generation/typecheck, lint and Vitest remain the intended validation gates.
- Performed a concrete application-boundary review and removed one unnecessary `as any` escape in ConfigurationReversionService by preserving ConfigurationScope through repository calls.
- No speculative architecture, transport or UI was added during validation review.
- Fix commit: cd12d68884aff0e0d6016e5a14d7d3f685d78e31.
- Milestone 2 implementation remains functionally complete but CI validation evidence is still unavailable from the accessible workflow history; do not mark green.

## Exact next action
1. Obtain repository CI validation evidence for the latest Milestone 2 commit range when workflow visibility/runs are available; run or inspect typecheck, lint, tests and build rather than inferring success.
2. If concrete validation failures appear, fix only those failures and revalidate.
3. If validation is clean, close Milestone 2 with a concise architecture/status checkpoint.
4. Then inspect the repository roadmap and select the next dependency-ordered milestone without recreating completed configuration work.
5. Update this checkpoint after validation/closure.

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
