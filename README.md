# Universal Matching Platform

A commercially oriented, internationally adaptable matching platform designed for Web, iOS and Android.

## Repository role
This repository is the persistent project record and development source of truth.

## Key documents
- PROJECT_MASTER.md — vision and core concept
- DECISIONS.md — confirmed decisions
- DEVELOPMENT_STATUS.md — current progress and next actions

## Database deployment

Database schema changes are managed as immutable ordered SQL artifacts in `packages/database/migrations`.

Before starting a production API deployment, apply pending migrations with:

`DATABASE_URL=postgresql://... pnpm --filter @universal/database migrate`

The command uses the packaged migration artifacts and `schema_migrations` tracking, so reruns skip already-applied versions. Do not edit an already-deployed migration; add a new higher-numbered migration instead.

