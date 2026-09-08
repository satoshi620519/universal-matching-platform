# Deployment Guide

## Deployment model

Deploy API, Web, Admin, database, and supporting infrastructure as separate production concerns. Use environment-specific secrets and never reuse local/demo credentials.

## Pre-deployment

1. Complete INSTALLATION.md verification.
2. Configure production secrets outside source control.
3. Configure HTTPS/TLS and restricted administrative access.
4. Create and test database backups.
5. Apply pending migrations:

```sh
DATABASE_URL=postgresql://... pnpm --filter @universal/database migrate
```

6. Run release gates:

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Configuration

Use Admin Quick Launch for purchaser-controlled branding, regions, categories, profiles, feature visibility, terminology, matching rules, onboarding, and publication.

Secrets, provider credentials, infrastructure endpoints, and privileged access remain deployment configuration.

## Demo deployments

Use a dedicated demo environment and follow DEMO_DEPLOYMENT_SPEC.md. Demo reset commands are not production database maintenance commands.

## Post-deployment verification

- API health and authenticated flows respond
- published configuration is active
- administrative authorization remains restricted
- database migrations are recorded
- TLS and production secrets are configured
- backup/restore procedures are available
