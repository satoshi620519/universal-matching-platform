# Database migration execution contract

## Purpose

This directory contains ordered SQL migration artifacts owned by `@universal/database`.

## Artifact naming

Migration files use the form:

`NNNN_description.sql`

where `NNNN` is a zero-padded positive integer migration version. Versions must be unique and strictly sortable by their numeric prefix.

## Tracking

The configured migration tracking table is `schema_migrations`.

Each successfully applied migration records its numeric version and completion timestamp. The exact physical column representation is an implementation detail of the runner; migration application must be idempotent with respect to already-recorded versions.

## Execution rules

1. Discover only `.sql` files matching the migration filename convention.
2. Sort migrations by numeric version ascending.
3. Reject duplicate migration versions before executing any migration.
4. Create the tracking table if it does not exist.
5. For each unapplied migration, execute the migration and its tracking-record write atomically when the database supports transactional DDL.
6. Record a migration only after its SQL completes successfully.
7. Stop on the first failed migration; do not mark a failed migration as applied.
8. Never silently skip a migration whose version is absent from the tracking table.
9. Re-running against the same database must skip already-applied versions without re-executing their SQL.
10. Migration artifacts are immutable after application. A changed applied migration requires a new versioned migration rather than editing the old file.

## Failure semantics

A migration failure is a deployment/database failure, not an application-level validation error. The runner must return a non-success result and preserve the database in the strongest rollback state supported by the database engine.

## Integrity and immutability policy

Migration artifacts are append-only release inputs. Once a version has been deployed, its SQL content must not be edited, renamed, or reused for different semantics. A database version record proves application of a version, not the identity of arbitrary replacement content; operational integrity therefore relies on immutable source/release artifacts and code review. Any correction must be delivered as a new, higher-numbered migration.

The runner intentionally executes the packaged artifact set selected by the deployed build. Do not mix migration files from different releases.

## Deployment command

The production-facing command is:

`DATABASE_URL=postgresql://... pnpm --filter @universal/database migrate`

It builds the database package, verifies the packaged migration directory is used, discovers ordered pending migrations, and applies each migration transactionally through PostgreSQL before recording its version in `schema_migrations`. The command is idempotent for already-recorded versions.

CI also runs this same deploy-facing command against its PostgreSQL service. A successful source-level review is not a substitute for checking the resulting CI execution before release tagging.

## Scope

This contract defines artifact discovery, ordering, tracking, immutability and application semantics. The concrete PostgreSQL runner lives in `packages/database/scripts/migrate-postgres.mjs`.
