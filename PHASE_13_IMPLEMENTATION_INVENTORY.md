# PHASE 13 IMPLEMENTATION INVENTORY

## Source-level confirmation
Phase 13 is not starting from zero. Concrete implementation already exists in the repository:

### API
- AdministrativeCapabilityAccessService provides server-side can/require capability checks.
- AdministrativeRoleAccessService resolves active persisted role assignments.
- AuditRecordRepository is append-only.
- AuditRecordService validates and appends data-minimized sensitive-operation records.
- Administrative role-management controllers already prove 401-before-mutation, 403-on-capability-denial and thin transport composition.

### Admin application
`apps/admin` already contains a working React/Vite administration application and a moderation workspace.
The moderation workspace calls browser API adapters and explicitly relies on server-side capability checks.

## Corrected Phase 13 priority
Do not build a second admin shell or recreate moderation UI.

The next implementation work should extend the existing admin application with missing read-only surfaces, starting with an administrator capability identity endpoint because it enables capability-driven navigation without trusting frontend role assumptions.

## Exact next implementation slice
1. Add a server-side administrative capability enumeration/query boundary based on the existing AdministrativeCapabilityAccessService.
2. Expose authenticated GET /administration/me/capabilities through a thin controller.
3. Add API/controller tests for 401, empty capability set and authorized capability response.
4. Add a browser adapter in apps/admin.
5. Integrate capability-driven visibility into the existing navigation.

This sequence reuses existing role persistence, capability policy, authentication and admin UI.
