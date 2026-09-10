# Web Demo / Product Progress

> **次回セッション開始時は、このファイルを最初に読むこと。**
> このファイルに書かれている「現在の状態」「最後に完了した作業」「次にやる作業」を基準にし、完了済み作業を繰り返さない。

## Current objective
Move the project from the client-side Web showcase into the real matching-system implementation. The user explicitly wants matching functionality actually implemented, not simulated UI interactions.

## Working rules
- Preserve the current premium NEXA visual direction.
- Record concrete work and exact stopping points to prevent duplicate work.
- Do not repeat completed implementation or visual layers unless a demonstrated defect requires it.
- Do not add unrelated features or speculative infrastructure.
- Do not request screenshots.
- Do not start Android while the real Web/backend matching implementation is incomplete.
- When the user says 「作業を進めて」, continue from the exact state recorded here instead of restarting an earlier phase.
- Before changing code, inspect the latest GitHub state and this file.
- If a capability already exists, verify/connect it instead of recreating it.

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
- Render workspace ID: `tea-dah0i9m1egvs73c1r0p0`

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

## 2026-09-10 completed today
### 1. Web -> production API connection fixed
- Found that `apps/web/src/api.ts` defaulted to `http://localhost:3000`.
- This meant the Render-hosted Web demo could not use the live Render API unless `VITE_API_BASE_URL` was separately supplied.
- Changed the default to:
  `https://universal-matching-platform-api.onrender.com`
- Commit: `5dad484dd9be3dce47e293652ffa0baf13115249`
- Commit message: `fix(web): point demo API client at live Render API by default`
- This was a real integration fix, not a visual/demo-only change.

### 2. Render verification after the Web API connection fix
- Render automatically deployed the commit because the services are linked to `main`.
- Latest observed Render deploy for the service:
  - Deploy ID: `dep-dah77mpt0dsc73dom2v0`
  - Commit: `5dad484dd9be3dce47e293652ffa0baf13115249`
  - Status: **live**
  - Started: `2026-09-10T09:09:47Z`
  - Finished: `2026-09-10T09:12:02Z`
- Do not manually trigger another Render deploy after a GitHub push unless auto-deploy is actually disabled.

### 3. Important E2E finding
- After the API connection fix and live deploy, Render request logs still contained **no actual user API request**.
- Therefore the next unfinished work is NOT another implementation rewrite.
- The next task is to execute/verify the real E2E path against the live Web/API integration and identify the first actual runtime failure.

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

## Current verified deployment state
### Web
- Latest Web integration commit: `5dad484dd9be3dce47e293652ffa0baf13115249`
- Latest observed Render deploy: `dep-dah77mpt0dsc73dom2v0`
- Status: **live**

### API
- The API service also observes the same monorepo commit because it is linked to `main`.
- Latest observed deploy on the API service for `5dad484dd9be3dce47e293652ffa0baf13115249`:
  - Deploy ID: `dep-dah77mpt0dsc73dom2v0`
  - Status: **live**
- Previous API notification integration commit:
  `9c5fc19201ae7eb610922d8727ccaeaae5eaf859`
- The notification integration was subsequently superseded by the later `main` commit/deploy above.

## Still required before completion
1. **Live E2E verification — highest priority next task.**
2. Verify registration/profile bootstrap against the live API.
3. Verify discovery -> Like/Pass -> mutual Match -> conversation -> message -> notification with persistent server state.
4. Verify notification read state.
5. Verify block/report/safety restrictions.
6. Verify international country/region/distance behavior.
7. Seed safe demo categories/accounts/profiles where needed for repeatable buyer-facing Web demo flows, only if the live E2E path proves this is required.
8. Complete remaining matching lifecycle operations only where the existing domain requires them.
9. After Web/backend matching is proven, continue remaining release-candidate/commercial packaging work.

## Exact stopping point — 2026-09-10 session end
**Do not restart from the visual landing page or reimplement matching.**

The session ended immediately after confirming:
1. `apps/web/src/api.ts` now points to the live Render API by default.
2. Commit `5dad484dd9be3dce47e293652ffa0baf13115249` is live on Render.
3. The latest Render deploy observed is `dep-dah77mpt0dsc73dom2v0`, status **live**.
4. No real API request has yet appeared in Render request logs after this fix.
5. Therefore the next action is to **perform the real E2E verification**, not to make another speculative code change.

## NEXT SESSION — START HERE
### First action
1. Read this file.
2. Confirm GitHub `main` is still at/after `5dad484dd9be3dce47e293652ffa0baf13115249`.
3. Confirm Render deploy for that commit is still **live**.
4. Do NOT redo the API-base-URL fix.
5. Do NOT rebuild the matching engine.
6. Inspect the existing E2E/demo/auth test tooling and determine the safest existing way to exercise the real API path.
7. Run the first real flow in this exact order:
   `register -> sign-in -> authenticated account -> profile bootstrap -> discovery -> Like/Pass -> mutual Match -> conversation -> message -> notification -> notification read`
8. Record the first observed failure exactly (endpoint, status/error, relevant code path) before modifying code.
9. Fix only that first confirmed failure.
10. Let Render auto-deploy the code change and verify **live**.
11. Continue to the next E2E step.
12. At the end of the session, update this file again with exact commit SHA, deploy ID, status, verified steps, first remaining failure, and the next single concrete task.

### Do not do
- Do not ask the user for screenshots.
- Do not manually trigger Render deploy after a normal GitHub push.
- Do not invent database credentials.
- Do not create duplicate matching logic.
- Do not redesign the NEXA landing page unless specifically requested.
- Do not start Android work yet.
- Do not claim an E2E step is verified unless there is actual tool/test evidence.

## Anti-duplication rule
Before every future change, compare the latest commit and this file against the requested task. If a capability already exists, verify or connect it instead of recreating it.
