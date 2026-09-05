# Installation Guide

This guide installs the Universal Matching Platform from a clean checkout for local evaluation and buyer verification.

## Prerequisites
- Node.js 22 or newer
- pnpm 10 (Corepack is recommended)
- Docker with Docker Compose

## 1. Clone and install

```bash
git clone <your-repository-url> universal-matching-platform
cd universal-matching-platform
corepack enable
pnpm install --no-frozen-lockfile
```

If installing from a marketplace archive, extract it and run the last three commands from the project root.

## 2. Start local infrastructure

The repository includes PostgreSQL 17 and Redis 7 for local development:

```bash
docker compose up -d
docker compose ps
```

Verify both containers are healthy before continuing.

## 3. Configure the database

Copy the environment template, then apply migrations:

```bash
cp .env.example .env
set -a; . ./.env; set +a
pnpm --filter @universal/database migrate
```

On Windows PowerShell, set `DATABASE_URL` from `.env.example` in the current session before running the migration command.

Migration history is tracked in `schema_migrations`. Never edit a migration already deployed; add a new higher-numbered migration.

## 4. Verify the checkout

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Do not proceed to production until these commands pass in the target environment.

## 5. Start applications

Run in separate terminals:

```bash
pnpm --filter @universal/api dev
pnpm --filter @universal/web dev
pnpm --filter @universal/admin dev
```

## 6. First buyer configuration

Use Admin Quick Launch in this order:
1. Branding
2. Countries and regions
3. Categories and onboarding
4. Feature visibility
5. Terminology labels
6. Publish and verify the immutable configuration snapshot

## Production notes

Local Docker defaults are for evaluation only. Before production deployment, replace development credentials, configure TLS and hosting, and use appropriate managed infrastructure.

## Troubleshooting

### pnpm version mismatch
Run `corepack enable` and verify `pnpm --version`.

### Database connection failure
Confirm Docker is running with `docker compose ps`, then verify `DATABASE_URL`.

### Migration failure
Do not delete migration history to bypass an error. Fix connectivity or configuration and rerun; existing versions are tracked and skipped.

## Release verification record
A marketplace release should record the exact clean-environment commands and results. The final release checklist is the authority for sign-off.
