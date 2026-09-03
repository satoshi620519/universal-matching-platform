# M6 Progress Checkpoint

Updated 2026-09-03.

## Current state
M6 operational safety/moderation vertical slice is implemented on `main`; execution verification is still pending.

## Completed in this slice
- Report and moderation-case persistence (migrations 0018, 0019).
- Prisma models for reports/cases and domain-neutral report target IDs.
- Authenticated report submission and reporter-scoped report listing.
- Moderator/administrator `manage-moderation` authorization.
- Report and moderation-case lifecycle transitions.
- Moderation action application using the existing `SafetyEnforcementRepository`.
- Immediate restriction checks in matching, messaging, and discovery.
- Privileged moderation audit records using the existing `AuditRecordService`.

## Main commits in order
- `47a980f76341145ae954d93b6c244807da47bad2` — initial M6 report/case migration.
- `652292f7d956bb464b02b408b50668c23931c426` — Prisma schema report/case models.
- `9b661e610d2020bb39b3010230ab528227cc06fe` — report/case repository implementation.
- `4a1e876a3f7e4f8cc5fd6f8957d7501c987649ae` — moderation capability authorization.
- `691adaf65b8cc73b0e66d53e8d80da92a7519a8f` — enforcement persistence.
- `5a59af4fd060af6d76e437c47ef344d7e73684fe` — moderation service.
- `14cb5cf65f56be9a3139862038525a3ec99b61d9` — safety controller.
- `4c3e5c59b72f664d2cf3738b3b8c0c48b57847b7` — app module registration.
- `6da86c3e2af1c7efd2414571183a809c1845349b` — matching restriction gate.
- `96408f6f85961c173d8da248fa658082d25e9ff7` — messaging restriction gate.
- `5ad35df5baf72976c622fe54e601070a41298e69` — domain-neutral report target migration.
- `d8395760605d1cd0ec15f5b616d548ee729c9c2d` — Prisma target ID alignment.
- `f8a1fe6b91902ed839f8589c0610675386d5576c` — discovery restriction gate.
- `4a445ffc0606977f3b5e5f8c97beb0f145980fd2` — M6 completion audit refresh.

## Exact next task
Add/refresh M6 tests for:
1. cross-account report read denial;
2. moderator/administrator authorization denial for privileged actions;
3. immediate matching/messaging/discovery enforcement effect;
4. audit persistence for privileged moderation actions;
5. migration count reconciliation for 0018/0019;
then run current-main CI and record actual execution evidence.

Do not mark M6 complete until those tests and current-main CI are green.