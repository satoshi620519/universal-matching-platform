# Troubleshooting

## pnpm or Node version problems

Enable Corepack and verify the required tool versions:

```sh
corepack enable
node --version
pnpm --version
```

## Docker services do not start

Run:

```sh
docker compose ps
docker compose logs
```

Resolve container health failures before starting application services.

## Database connection or migration failure

Verify `DATABASE_URL`, database reachability, and Docker/container status. Do not delete `schema_migrations` or edit an already deployed migration to bypass an error.

## Typecheck, lint, test, or build failure

Run the failing root command directly to isolate the workspace. Fix the reported contract or dependency issue rather than disabling a CI gate.

## Configuration does not appear active

Confirm the Admin Quick Launch draft was explicitly published. Draft edits do not replace the immutable published version automatically.

## Demo seed/reset is refused

Verify all required markers:

- `NODE_ENV=demo`
- `DEMO_MODE=true`

Reset additionally requires:

- `DEMO_DATABASE_RESET_APPROVED=true`

Do not attempt to bypass these guards for production databases.

## Security concern

Do not publish secrets or vulnerability details in public channels. Follow SECURITY.md.
