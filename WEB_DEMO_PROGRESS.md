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

Latest live-module fix: `f387621e568b5ac19c4c74a56d4f0502830e3e5d5d` (`fix(web): keep live matching inside demo shell`).
Vite injection: `dd23ec0eac2d6bd30a281075a357327233f3974d`.

## Latest Render verification
- Web deploy for commit `87667aa25df5c18a45a80cbd65dd4d46c5f49723` is `dep-dah577ht0dsc73dmngag` and is **live**.
- API deploy for commit `59846989a113cd7e595c3dfa6093bd38067b0373` is `dep-dah6kmjeogqs739lqmcg` and is **live**.
- API build completed successfully: domain, database, and API builds all succeeded.
- Database migration runner completed successfully with `Applied migrations: none`.
- NestJS application started successfully.
- Render confirmed `Your service is live` and exposed `https://universal-matching-platform-api.onrender.com`.
- Runtime route registration confirmed authentication, profiles, discovery, matching, conversations, notifications, safety, administration, configuration, verification, analytics, and payment webhook routes.
- The previous PaymentWebhookController runtime-token DI failure is resolved by commit `59846989a113cd7e595c3dfa6093bd38067b0373`.

## Database wiring decision
The repository `render.yaml` contains the correct declarative wiring:
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
The Render Postgres query tool cannot currently query this database because it connects through the external endpoint without TLS and receives `SSL/TLS required`. This does not mean the database is broken; the API's successful migration/startup proves the managed database connection used by the service is working.

## Still required before completion
1. Verify registration/profile bootstrap against the live API.
2. Verify discovery -> Like/Pass -> mutual Match -> conversation -> message -> notification with persistent server state.
3. Verify block/report/safety restrictions.
4. Verify international country/region/distance behavior.
5. Seed safe demo categories/accounts/profiles where needed for repeatable buyer-facing Web demo flows.
6. Complete remaining matching lifecycle operations only where the existing domain requires them.
7. After Web/backend matching is proven, continue remaining release-candidate/commercial packaging work.

## Exact stopping point
- Latest Web deploy: `dep-dah577ht0dsc73dmngag` — **live**.
- Latest API deploy: `dep-dah6kmjeogqs739lqmcg` — **live**.
- Latest API commit: `59846989a113cd7e595c3dfa6093bd38067b0373`.
- API startup, migration, Nest initialization, route registration, and Render live state are confirmed.
- Latest progress-record commit is the commit containing this update.

## Next concrete task
Run the live matching E2E path against the now-live API and existing Web integration: registration/sign-in -> profile bootstrap -> discovery -> persistent Like/Pass -> mutual Match -> conversation -> message -> notification/read state. Record every observed failure before changing code. Do not recreate existing matching logic or add unrelated features.

## Anti-duplication rule
Before every future change, compare the latest commit and this file against the requested task. If a capability already exists, verify or connect it instead of recreating it.
