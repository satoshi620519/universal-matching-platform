# SAFETY AND MODERATION

## Purpose
Phase 12 defines the safety, trust, and moderation contract for the Universal Matching Platform. Safety enforcement must be reusable across discovery, matching, messaging, and future product surfaces.

## Current canonical architecture
- `SafetyReport` stores authenticated user reports with target type, target id, reason, status, and timestamps.
- `ModerationCase` provides a one-to-one moderation workflow for a report.
- `SafetyEnforcement` stores account restrictions with effective/expiry/revocation timestamps.
- `EffectiveSafetyRestrictionService` resolves the effective restriction before protected capabilities execute.
- `AuditRecordService` records moderation workflow and enforcement actions.
- `AdministrativeCapabilityAccessService` gates moderation operations.

The existing safety implementation is the source of truth. Do not introduce parallel report, enforcement, or moderation repositories.

## Report intake
Supported target types:
- user
- content
- message

Required fields:
- authenticated reporter
- target id
- target type
- reason

Report listing is limited to the authenticated reporter's own reports.

## Moderation lifecycle
Report lifecycle:
- triaged
- closed

Case lifecycle:
- under-review
- actioned
- closed

Moderation actions currently supported:
- warning
- restrict-features
- restrict-communication
- suspend
- close-without-action

All operator actions require moderation capability authorization and are audit logged.

## Enforcement
Current effective restrictions:
- none
- feature-restricted
- communication-restricted
- suspended

Restrictions are time-aware through effective and expiry timestamps and support revocation in the persistence model. Protected capabilities must consult the effective restriction service rather than duplicating enforcement logic.

## Phase 12 gaps to implement next
The following roadmap requirements are not yet represented by the canonical implementation and must be completed without duplicating existing infrastructure:

1. **User block**
   - Persist a directed account-to-account block relation.
   - Enforce it in discovery, matching, messaging, and other user-to-user surfaces.
   - Make the operation idempotent and auditable where appropriate.

2. **Ban semantics**
   - Add an explicit permanent-ban action/restriction, distinct from temporary suspension.
   - Ensure banned accounts cannot authenticate/use protected capabilities according to the account lifecycle contract.

3. **Evidence/context capture**
   - Extend report intake with optional structured context/evidence references without storing unnecessary sensitive data.
   - Preserve enough context for moderation review while keeping privacy boundaries explicit.

4. **Abuse prevention / rate limiting / spam controls**
   - Add reusable request limits for report submission and other abuse-sensitive operations.
   - Add spam-oriented controls for high-volume interactions.
   - Keep limits configurable and avoid embedding product-specific assumptions.

5. **Moderation queue read model**
   - Provide authorized operators with a queue/list view of actionable reports/cases, rather than only transition-by-id endpoints.

## Non-goals for Phase 12
- Identity verification integrations.
- External image moderation providers.
- AI-assisted moderation.

These remain optional future modules unless explicitly promoted into the roadmap.

## Acceptance criteria
Phase 12 is complete only when:
- block behavior is persisted and enforced across relevant user-to-user surfaces;
- reports support the required context/evidence contract;
- moderation operators can inspect and action a queue;
- warning, restriction, suspension, and ban semantics are explicit;
- moderation and enforcement changes are auditable;
- abuse-sensitive endpoints have effective rate/spam controls;
- automated tests cover positive, negative, expiry/revocation, authorization, and idempotency behavior;
- clean CI remains green after the implementation changes.
