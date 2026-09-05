# Universal Matching Platform

A commercially oriented, internationally adaptable matching platform designed for Web, iOS and Android.

## Repository role
This repository is the persistent project record and development source of truth.

## Buyer and release documentation
- INSTALLATION.md — clean-environment installation and local infrastructure
- QUICK_START.md — shortest path through the existing buyer Quick Launch flow
- RELEASE_CHECKLIST.md — marketplace release sign-off
- RELEASE_VERIFICATION.md — CI versus manual clean-environment evidence
- CHANGELOG.md — buyer-facing release history and versioning policy
- SECURITY.md — vulnerability handling and deployment security responsibilities
- LICENSE_DECISION_REQUIRED.md — commercial license selection blocker before source distribution

## Project records
- PROJECT_MASTER.md — vision and core concept
- MASTER_DEVELOPMENT_ROADMAP.md — development completion roadmap
- DEVELOPMENT_STATUS.md — current progress and next actions
- DECISIONS.md — confirmed decisions
- CONTINUITY_PROTOCOL.md — continuation and handoff protocol

## Database deployment

Database schema changes are managed as immutable ordered SQL artifacts in `packages/database/migrations`.

Before starting a production API deployment, apply pending migrations with:

`DATABASE_URL=postgresql://... pnpm --filter @universal/database migrate`

The command uses the packaged migration artifacts and `schema_migrations` tracking, so reruns skip already-applied versions. Do not edit an already-deployed migration; add a new higher-numbered migration instead.
