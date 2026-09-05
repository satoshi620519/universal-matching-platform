# Quick Start

Get a local buyer evaluation running with the fewest steps. For prerequisites and troubleshooting, see INSTALLATION.md.

## 1. Start infrastructure

```bash
docker compose up -d
```

## 2. Install dependencies

```bash
corepack enable
pnpm install --frozen-lockfile
```

## 3. Configure and migrate

```bash
export DATABASE_URL='postgresql://universal:universal@localhost:5432/universal_matching'
pnpm --filter @universal/database migrate
```

## 4. Start the platform

Use separate terminals:

```bash
pnpm --filter @universal/api dev
pnpm --filter @universal/web dev
pnpm --filter @universal/admin dev
```

## 5. Complete Admin Quick Launch

The purchaser configuration path has 11 steps:

1. Branding
2. Regions
3. Categories
4. Profile Schema
5. Matching Categories
6. Features
7. Legal & Support
8. Terminology
9. Matching Rules
10. Onboarding
11. Review & Publish

Save the draft before publishing. Publication creates an immutable configuration version; later changes should be published as a new version.

## Recommended first launch

Keep the first evaluation intentionally simple:
- One country and one locale
- One primary matching category
- Only required profile fields
- Enable only the features needed for the intended use case
- Leave terminology at defaults unless adapting the product to a different matching market
- Configure real legal/support destinations before public use

## Verify before handoff

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

A green command sequence verifies the repository baseline. Production infrastructure and marketplace release sign-off remain separate release-checklist tasks.
