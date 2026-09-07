# Phase 13 Dashboard Read Model Checkpoint

- Added `apps/admin/src/admin-dashboard-read-model.ts` as the frontend boundary for dashboard data.
- Added focused unit coverage in `apps/admin/src/admin-dashboard-read-model.test.ts`.
- No direct browser-to-database access was introduced.
- No Phase 12 safety/moderation domain was reimplemented.
- Next: connect this boundary to an authenticated server-side administration read API using existing authorization and repository boundaries.

- 2026-09-07 reconciliation: the authenticated `AdministrativeDashboardController` and `AdministrativeDashboardService` already implement this exact server-side boundary, and `createBrowserAdminDashboardApi` already consumes `/administration/dashboard` with browser credentials.
- Verified the authorization chain is principal resolver -> `view-dashboard` capability -> operational read model; no direct database access or duplicate dashboard repository is needed.
- Removed the stale `AllowAllDiscoveryExclusionPolicy` import discovered during integration review; the active DI binding remains `UserBlockDiscoveryExclusionPolicy`.
- Next exact Phase 13 task: audit the existing administrative directory browser APIs against their server controllers for the same authenticated transport and capability-boundary pattern, fixing only concrete inconsistencies.
