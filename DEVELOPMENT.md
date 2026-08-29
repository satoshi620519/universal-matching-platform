# Development

## Prerequisites
- Node.js LTS
- pnpm 10+
- Docker and Docker Compose

## Start infrastructure

```bash
docker compose up -d postgres redis
```

## Install and validate

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## M0 API health

The engineering baseline includes a minimal API health endpoint:

```text
GET /health
→ { "status": "ok" }
```

Product features must not be added until the M0 acceptance checklist is validated.
