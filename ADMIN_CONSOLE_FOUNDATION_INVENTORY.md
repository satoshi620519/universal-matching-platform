# PHASE 13 ADMIN CONSOLE — EXISTING FOUNDATION INVENTORY

## Purpose
Record the concrete administrative foundation already present before adding new Phase 13 implementation. This prevents duplicating authorization, moderation, audit, or privileged-operation logic.

## Confirmed existing boundaries
### Administrative authorization read path
Existing design evaluates administrative privilege from persisted active role assignments:

`accountId -> RoleAssignmentRepository.findActiveForAccount -> lifecycle filtering -> AdministrativeRoleAccessService -> capability decision`

Authentication establishes identity only and is not treated as administrator privilege.

### Capability policy
Authorization is capability-based rather than scattered role-name checks. Existing documented capabilities include:

- `manage-administrative-roles`
- `review-failed-email-outbox`

Role mutation composition is already defined as:

1. identify actor;
2. require capability;
3. perform lifecycle-qualified mutation;
4. append mutation audit record.

### Audit correlation
Privileged application operations can carry one optional opaque correlation ID into successful audit records. Credentials, request bodies, provider payloads, arbitrary headers, and unnecessary message contents are explicitly excluded.

### Privileged transport boundary
The repository deliberately avoids exposing public administrative HTTP endpoints until authoritative operator authorization and append-oriented audit persistence are available. Existing failed-email operations remain application-service boundaries rather than prematurely exposed admin routes.

## Gap analysis for Phase 13
The following should be built next rather than duplicated:

1. Verify the concrete persisted administrator role model and append-oriented audit implementation in source.
2. Define the stable administrative API contract around those existing services.
3. Add the first read-only administrative slice only after server-side capability enforcement is wired.
4. Add privileged mutations only with existing audit composition.
5. Reuse Phase 12 moderation state and enforcement rules instead of creating a second moderation engine.

## First implementation slice
The lowest-risk, highest-leverage Phase 13 slice is:

**Administrative foundation contract**
- capability matrix;
- administrator principal resolution contract;
- audit event contract;
- pagination/filtering standards for admin reads;
- error semantics;
- explicit list of read-only endpoints suitable for the first UI.

No dashboard UI or privileged endpoint should bypass these boundaries.

## Progress
- Phase 13 specification: complete.
- Existing-boundary inventory: complete.
- Next exact task: inspect concrete source implementations for role assignment, administrative access and audit persistence, then document the stable admin API contract.
