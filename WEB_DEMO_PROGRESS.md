# Web Demo / Product Progress

## Current objective
Move the project from the client-side Web showcase into the real matching-system implementation. The user explicitly wants matching functionality actually implemented, not simulated UI interactions.

## Working rules
- Preserve the current premium NEXA visual direction.
- Record concrete work and exact stopping points to prevent duplicate work.
- Do not repeat completed implementation or visual layers unless a demonstrated defect requires it.
- Do not add unrelated features or speculative infrastructure.
- Do not request screenshots.
- Do not start Android while the real Web/backend matching implementation is incomplete.

## Current baseline
- Repository: `satoshi620519/universal-matching-platform`
- Branch: `main`
- Web demo Render service: `universal-matching-platform-demo`
- Web demo URL: `https://universal-matching-platform-demo.onrender.com`
- API Render service: `universal-matching-platform-api`
- API URL: `https://universal-matching-platform-api.onrender.com`
- PostgreSQL: `universal-matching-platform-db`
- PostgreSQL ID: `dpg-dah40vtbedkc7391cud0-a`
- API service ID: `srv-dah4a71t0dsc73egt1ng`

## Real matching implementation already completed
- Persistent profile/category model and validation
- Discovery with country/region/locality scope
- Search/sorting and optional distance matching
- Configurable matching rules
- Persistent like/pass decisions
- Idempotent match transitions
- Transaction/advisory-lock protection
- Mutual-match detection and notifications
- Persistent `GET /matches`
- Persistent `GET /matches/history`
- Mutual-match conversation creation
- Persistent messaging/read/soft-deletion/realtime foundations
- Block/report/safety foundations
- Authentication/session foundations
- Notifications, analytics, configuration, moderation, verification, administration, payments/entitlements foundations

## Web live integration
`apps/web/src/live-matching.ts` is connected to the existing API boundary and supports:
- Login and registration
- Authenticated account/profile loading
- Profile bootstrap
- Authoritative discovery
- Persistent Like/Pass
- Persistent match list/history
- Mutual-match conversation handoff
- Server-backed messages
- Server-backed notifications/read state
- Live mode isolated inside the existing NEXA shell

Latest live-module fix: `f387621e568b5ac19c4c74a56d4f0502830e3e5d` (`fix(web): keep live matching inside demo shell`).
Vite injection: `dd23ec0eac2d6bd30a281075a357327233f3974d`.

## Latest Render verification
API deploy: `dep-dah55h9al16s73cno7rg`.
At the latest verification, Render successfully completed the API build and reached the start command, but `prisma migrate deploy` failed before application startup.

Exact failure:
`Prisma schema validation - (get-config wasm)` / `P1012` / `The URL must start with the protocol postgresql:// or postgres://`.

Therefore the API's current `DATABASE_URL` is still not the managed database connection string. This is an environment wiring problem, not a Prisma schema/build problem.

The managed PostgreSQL instance itself is `available` in Singapore.

## Database wiring decision
The repository `render.yaml` already contains the correct declarative wiring:
```yaml
envVars:
  - key: DATABASE_URL
    fromDatabase:
      name: universal-matching-platform-db
      property: connectionString
```
Render's documented behavior is that `fromDatabase.connectionString` resolves the internal PostgreSQL connection string during Blueprint synchronization. Do not paste or invent a database password/connection string.

The current Render environment-variable action available to this session only accepts literal values; it cannot express `fromDatabase`. Therefore repeatedly setting a literal placeholder is prohibited because it recreates the known failure.

## Important verification
The Render Postgres query tool cannot currently query this database because it connects through the external endpoint without TLS and receives `SSL/TLS required`. This does not mean the database is broken; Render's documented internal connection string is the appropriate connection for a same-region Render service.

## Still required before completion
1. Synchronize the existing Render API service with the repository Blueprint/dashboard so `DATABASE_URL` is populated from `universal-matching-platform-db.connectionString`.
2. Confirm API starts and Prisma migrations complete.
3. Seed safe demo categories/accounts/profiles where needed.
4. Verify registration/profile bootstrap.
5. Verify discovery -> Like/Pass -> mutual Match -> conversation -> message -> notification.
6. Verify block/report/safety restrictions.
7. Verify international country/region/distance behavior.
8. Complete remaining matching lifecycle operations only where the existing domain requires them.

## Exact stopping point
- Latest API deploy checked: `dep-dah55h9al16s73cno7rg` — `update_in_progress` at the last poll because Render was processing the failed-start/redeploy cycle.
- Latest confirmed failure cause: invalid/non-PostgreSQL `DATABASE_URL` at Prisma startup.
- Latest relevant GitHub fix commit: `f387621e568b5ac19c4c74a56d4f0502830e3e5d`.
- Latest progress-record commit before this update: `475f2879e82547c2d33c3e26a5b8ecc6fdf6bc9c`.

## Next concrete task
Use the supported Render Blueprint/dashboard synchronization path to bind the existing API service to the existing PostgreSQL instance. After the binding is active, let autoDeploy run and immediately verify Prisma migration/startup. Do not recreate the API service, recreate the database, or add duplicate matching logic.

## Anti-duplication rule
Before every future change, compare the latest commit and this file against the requested task. If a capability already exists, verify or connect it instead of recreating it.