# Universal Matching Platform

A commercially oriented, internationally adaptable matching platform designed for Web, iOS and Android.

## Repository role
This repository is the persistent project record and development source of truth.

## Developer extensibility
- DEVELOPER_EXTENSIBILITY.md — supported customization boundaries, API compatibility, and extension workflow
- API_AND_DEVELOPER_EXTENSIBILITY_SPEC.md — Phase 18 extension contract and acceptance criteria

## Buyer and release documentation
- INSTALLATION.md — clean-environment installation and local infrastructure
- ADMIN_GUIDE.md — administrator operation and Quick Launch publication
- USER_GUIDE.md — standard member journey
- CUSTOMIZATION_GUIDE.md — no-code and advanced customization boundaries
- DEVELOPER_GUIDE.md — source development workflow and extension rules
- DEPLOYMENT_GUIDE.md — production and demo deployment procedures
- TROUBLESHOOTING.md — common installation and operation failures
- FAQ.md — buyer-oriented frequently asked questions
- QUICK_START.md — shortest path through the existing buyer Quick Launch flow
- RELEASE_CHECKLIST.md — marketplace release sign-off
- RELEASE_VERIFICATION.md — CI versus manual clean-environment evidence
- CHANGELOG.md — buyer-facing release history and versioning policy
- SECURITY.md — vulnerability handling and deployment security responsibilities
- LICENSE_DECISION_REQUIRED.md — commercial license selection blocker before source distribution
- MOBILE_ACCEPTANCE_CHECKLIST.md — reproducible iOS/Android source-product acceptance flow

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
