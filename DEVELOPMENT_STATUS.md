# Development Status

CURRENT PHASE: Phase 3 — Implementation
CURRENT MILESTONE: Milestone 1 — Core API, database and identity
CURRENT TASK: Advance from the validated Account persistence migration boundary to the next grounded M1 implementation slice.
STATUS: The first Account migration is now validated against a real PostgreSQL service in CI, including apply, idempotent rerun, and failed-migration rollback semantics. CI #413 is green.

## Continuation protocol — READ FIRST
GitHub main is the persistent source of truth. Before every new work session:
1. Read this file.
2. Verify the files, commits and CI run named in the latest checkpoint.
3. Do not assume an unverified change passed CI.
4. Resume from the Exact next action section.
5. After every coherent implementation slice, update this file with files changed, commit SHA, CI state, unresolved constraints and the exact next action.

Never overwrite a working boundary based on conversational memory. Prefer repository state and CI evidence.

## Latest checkpoint — 2026-08-31

### Account migration execution gate — COMPLETE
- `packages/database/migrations/0001_create_accounts.sql` remains grounded exclusively in the physical Prisma Account schema.
- Added migration planning/execution boundaries and tests in `packages/database/src/migrations.ts`, `packages/database/src/executor.ts`, and their tests.
- Added the API migration runner and Prisma transaction adapter.
- Added PostgreSQL integration coverage for migration apply + idempotent rerun and failed-migration rollback.
- CI provisions PostgreSQL 16 and passes `DATABASE_URL` through Turbo test tasks.
- Rollback coverage uses a deterministic single-statement PostgreSQL failure (`SELECT definitely_missing_function()`), avoiding a false-positive failure caused by multiple commands in one prepared statement.
- Final rollback-test commit: `32f519d7419855802b73320ba52161b04d74e64a`.
- GitHub Actions CI run #413 completed successfully: PostgreSQL service healthy, typecheck, lint, all tests, integration tests, and build passed.
- Integration result in CI: `apps/api/src/database/migration-integration.test.ts` — 2 tests passed, not skipped.
- Migration gate is therefore complete and must not be reimplemented.

### CI/test fixes completed during this slice
- Adapted database executor to the `MigrationPlan.pending` contract and `ReadonlySet` applied-version input.
- Aligned planner tests with current synchronous duplicate-version validation and pending-plan semantics.
- Corrected Prisma adapter test doubles to mock `$executeRawUnsafe` / `$queryRawUnsafe`.
- Passed `DATABASE_URL` explicitly to Turbo test tasks so PostgreSQL integration tests execute in CI.

## Exact next action
1. Inspect the current Milestone 1 repository state for the next grounded Core API/database/identity implementation gap.
2. Select the smallest repository-consistent implementation slice; do not invent authentication-provider, JWT, session, payment-provider, or identity-provider contracts that remain unresolved.
3. Add focused tests before or with the implementation.
4. Run/verify CI and record the exact commit and CI result here.
5. Keep this migration gate fixed as completed; do not recreate it.

## Architecture constraints
- RequestPrincipal defines accountId, authenticationMethod and optional verificationLevel.
- AnonymousAuthenticationAdapter currently returns undefined.
- No token format, JWT parser, session store or external identity-provider contract is currently grounded in the repository.
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
- Database configuration/migration boundary.
- Account lifecycle, activation, lookup and tests.
- Entitlement lifecycle and tests.
- Verification lifecycle and verification access boundary.
- Request principal resolver boundary.
- Authenticated capability access boundary.
- Safety, moderation and audit domain foundations.
- Analytics, accessibility, operational quality, data lifecycle and deployment requirement foundations.
- Account persistence migration execution gate, including real PostgreSQL CI validation.
