# Web Demo / Product Progress

## Current objective
Move the project from the completed client-side Web showcase into the real matching-system implementation. The user explicitly wants matching functionality actually implemented, not only simulated UI interactions.

## Working rules
- Preserve the current premium NEXA visual direction.
- Record concrete work and the exact stopping point so future sessions can resume without duplicate work.
- Do not repeat completed implementation or visual layers unless a demonstrated defect requires it.
- Do not add unrelated features or speculative infrastructure.
- Do not request screenshots from the owner.
- Do not start Android while the real Web/backend matching implementation is still being completed.

## Current baseline
- Repository: `satoshi620519/universal-matching-platform`
- Branch: `main`
- Existing Web demo Render service: `universal-matching-platform-demo`
- Existing Web demo URL: `https://universal-matching-platform-demo.onrender.com`
- API Render service: `universal-matching-platform-api`
- API Render URL: `https://universal-matching-platform-api.onrender.com`
- PostgreSQL: `universal-matching-platform-db`

## Existing real backend
The API already contains substantial foundations for authentication, profiles/categories, discovery, matching transition persistence, messaging, realtime publication, notifications, safety/moderation, verification, analytics, configuration, administration, and payments/entitlements.

Existing important endpoints include profile creation/update, discovery, `POST /matches/decision`, mutual-match conversation creation, and conversation/message/notification endpoints.

## Work completed in this continuation
1. Audited the existing API before adding duplicate matching logic.
2. Confirmed `MatchInteraction` persistence and transactional mutual-match resolution already exist.
3. Added persistent `GET /matches` for authenticated mutual matches with public profile projection.
4. Added persistent `GET /matches/history` for authenticated match decision history.
5. Added `DatabaseService` access to `ProfileDiscoveryController` for those queries.
6. Created Render PostgreSQL `universal-matching-platform-db` in Singapore. Instance ID: `dpg-dah40vtbedkc7391cud0-a`.
7. Created Render API web service `universal-matching-platform-api` in Singapore. Service ID: `srv-dah4a71t0dsc73egt1ng`.
8. API build completed successfully on Render for the API codebase before database startup.
9. Added the persistent match-list/history methods to `apps/web/src/api.ts` so the Web client has an authoritative API boundary for match state.
10. Configured the existing Web demo Render service with `VITE_API_BASE_URL=https://universal-matching-platform-api.onrender.com` so future Web API calls target the deployed API instead of the localhost fallback.

## Current infrastructure blocker
- The API service exists and its build succeeds.
- API startup is blocked during `prisma migrate deploy` because its current `DATABASE_URL` is not securely connected to the managed PostgreSQL instance and previously resolved to `placeholder:5432`.
- The Render environment-variable tool available here accepts literal values and does not expose the managed PostgreSQL connection string as a safe `fromDatabase` reference.
- The repository `render.yaml` already contains the intended secure `fromDatabase` wiring.
- Do not invent or expose a database password/connection string.

## Real matching status
### Already implemented
- Profile/category model and validation
- Discovery with country/region/locality scope
- Search and discovery sorting
- Optional distance matching controlled by configuration
- Configurable matching rules
- Like/pass decision persistence
- Idempotent match transitions
- Transaction/advisory-lock protection for concurrent pair decisions
- Mutual-match detection
- Match-created notifications
- Match analytics
- Conversation creation from mutual match
- Messaging lifecycle, read state, soft deletion, realtime publication
- Block/safety enforcement around matching and communication
- Verification/moderation foundations
- Analytics/configuration foundations
- Authentication/session foundations
- Payment/entitlement foundations

### Newly connected Web API boundary
- `listMatches()` → `GET /matches`
- `listMatchHistory()` → `GET /matches/history`
- Existing `decideMatch()` → `POST /matches/decision`
- Existing mutual-match conversation handoff
- Existing conversation/message/notification client methods

## Still required before real product completion
1. Securely wire the Render API service to the managed PostgreSQL connection string.
2. Run Prisma migrations successfully on Render.
3. Seed demo categories/accounts/profiles safely.
4. Replace the NEXA demo's local-only match state with the existing authenticated API calls, preserving the current UI.
5. Replace the demo's local-only message state with the existing conversation/message API.
6. Replace hardcoded notifications with the existing notification API.
7. Verify registration → profile → discovery → like/pass → mutual match → conversation → message → notification end-to-end.
8. Verify block/report/safety restrictions against the real API.
9. Verify international configuration and distance behavior with persisted profiles.
10. Add remaining matching lifecycle operations only where the existing domain model requires them.
11. Update this record after each concrete checkpoint.

## Exact stopping point
Latest implementation commit: `3bc0c6d7bda04bd17a9393a641936f3bc8d2635d` (`feat(web): expose persistent matching queries to demo client`).
The Web demo Render deployment triggered by that commit is `dep-dah4plajnfac738a3qng` and was `build_in_progress` at the checkpoint.
The static Web service now has `VITE_API_BASE_URL` pointing at the deployed API URL.

The API deployment remains blocked by the unresolved secure PostgreSQL connection described above; do not repeat the known invalid placeholder/`${...}` environment-variable approach.

Next concrete task: wire the NEXA demo UI's existing discovery/match actions to the authoritative API boundary already present in `apps/web/src/api.ts`, while keeping the current visual implementation unchanged. Once the API database connection is fixed, run the full real matching flow against persisted data.

## Anti-duplication rule
Before every future change, compare the latest commit and this file against the requested task. If the capability is already implemented, verify or connect it instead of recreating it.
