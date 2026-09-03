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

## Current release gate limitation

The repository currently verifies that migration artifacts are packaged into `@universal/database/dist/migrations`, but it does not yet contain a concrete production migration runner that applies the `schema_migrations` contract to an empty PostgreSQL database. Therefore artifact packaging is a CI gate, while actual migration execution must be supplied before production deployment.

## Scope

This contract defines artifact discovery, ordering, tracking and application semantics. It does not prescribe a particular PostgreSQL driver or command-line framework. The concrete runner must use the repository's selected database access technology and must be covered by an empty-database integration test before the migration gate is considered complete.
