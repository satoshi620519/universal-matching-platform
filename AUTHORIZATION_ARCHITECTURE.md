# Authorization Architecture

## Status
Phase 2 architecture artifact — centralized authorization baseline.

## Purpose
Define how the platform makes consistent server-side decisions for protected actions across Web, iOS, Android, administration and future clients.

## Core principle
The backend is the final authority for protected actions. A client may improve UX by hiding unavailable actions, but client state never authorizes an operation.

## 1. Decision model

Every protected operation is expressed as:

Subject + Action + Resource + Context → Decision

Example:

Account A + send_message + Conversation C + request context → ALLOW / DENY

The result may also include machine-readable obligations or reason codes for clients and audit systems.

## 2. Authorization inputs

The policy engine evaluates only the inputs relevant to an action.

### Subject inputs
- authenticated account
- account lifecycle status
- assigned roles
- active entitlements
- verification outcomes
- active enforcement restrictions

### Action inputs
- stable capability/action key
- required assurance level
- rate or usage constraints where applicable

### Resource inputs
- resource owner/participants
- category
- deployment scope
- lifecycle state
- regional scope

### Context inputs
- deployment configuration version
- region
- trusted request metadata
- time/effective periods
- policy version

## 3. Policy composition

Authorization must compose multiple constraints rather than allowing one subsystem to bypass another.

Baseline order:

1. Authentication validity
2. Account lifecycle eligibility
3. Explicit enforcement restrictions
4. Resource relationship checks
5. Deployment/category/region policy
6. Role requirements
7. Verification requirements
8. Entitlement requirements
9. Usage/rate constraints
10. Final contextual policy

A later successful check does not override an earlier hard denial unless a policy explicitly defines an authorized exception.

## 4. Hard deny precedence

The following generally have deny precedence:
- suspended/closed account
- active enforcement action covering the requested capability
- missing required resource relationship
- region/deployment prohibition
- expired or revoked mandatory authorization

Commercial entitlement never overrides a safety suspension.
Administrative authority is explicitly scoped and audited rather than treated as a universal bypass.

## 5. Capability model

A capability is a stable, provider-neutral permission concept, for example:

- profile.publish
- discovery.view
- match.create
- conversation.create
- message.send
- media.upload
- report.submit
- verification.request
- admin.moderation.review

Capabilities are not UI labels. They are server-side contracts.

Policies map capabilities to conditions and scopes.

## 6. Decision outputs

A decision contains:

- effect: allow | deny
- capability
- evaluated policy version/reference
- reason code suitable for controlled client handling
- optional obligations
- decision timestamp/correlation id

Do not expose internal safety signals or sensitive moderation rationale through ordinary client reason codes.

## 7. Request-time architecture

Preferred request path:

Client
  ↓
API authentication
  ↓
Request validation
  ↓
Authorization decision
  ↓
Domain operation
  ↓
Transaction commit
  ↓
Audit/domain events

Authorization occurs before state mutation. Critical domain invariants may additionally verify authorization assumptions inside the transaction boundary.

## 8. Central service boundary

Authorization is a logical central service, not necessarily a separately deployed microservice.

Initial implementation should favor a shared backend authorization module/library with:
- one policy vocabulary,
- one evaluation interface,
- consistent adapters for domain data,
- auditable decision contracts.

Physical service separation is deferred until scale or organizational boundaries justify it.

## 9. Policy data adapters

The authorization layer reads authoritative inputs through explicit adapters:

- AccountStatusProvider
- RoleAssignmentProvider
- EntitlementProvider
- VerificationProvider
- SafetyRestrictionProvider
- ResourceContextProvider
- DeploymentPolicyProvider

Domain tables remain owned by their contexts. Authorization must not create shadow copies of all domain state.

## 10. Caching

Authorization caching is permitted only when correctness remains safe.

Rules:
- cache derived positive/negative decisions only with explicit TTL and invalidation strategy;
- safety restrictions and account suspensions require rapid invalidation;
- entitlement/verification expiry must be time-aware;
- a cache miss must safely fall back to authoritative evaluation;
- destructive enforcement events invalidate affected decision caches.

Initial implementation should optimize for correctness and observability before aggressive caching.

## 11. Consistency across clients

Web, iOS and Android use the same backend capability vocabulary.

Clients may request capability summaries for UX, for example:

GET /me/capabilities

Such summaries are advisory snapshots. The protected API endpoint always re-evaluates authorization.

## 12. Commerce integration

Commerce produces entitlement state; it does not directly grant endpoint access.

Flow:

Purchase confirmation
  ↓
Commerce validation
  ↓
Entitlement activation
  ↓
Authorization evaluates entitlement
  ↓
Capability decision

Revocation or expiry removes eligibility without requiring each feature to implement payment-provider logic.

## 13. Verification integration

Verification produces an authoritative outcome and assurance level.

Policies may require:

verification.level >= required level

Raw verification evidence is never needed by ordinary authorization evaluation.

## 14. Trust and Safety integration

Enforcement actions map to explicit scopes, such as:

- account.login
- profile.publish
- discovery.view
- message.send
- media.upload

A safety action can deny a capability independently of roles or paid entitlements.

## 15. Administration

Administrative actions use the same conceptual decision model but a separate capability namespace and explicit scope.

Examples:

- admin.moderation.case.read
- admin.moderation.case.assign
- admin.enforcement.apply
- admin.audit.read

High-impact actions require:
- explicit role/scope checks,
- audit records,
- correlation identifiers,
- optional stronger authentication policies.

## 16. Auditability

Significant decisions and all high-impact administrative actions should be auditable.

Audit metadata may include:
- actor
- action/capability
- resource reference
- effect
- policy version
- correlation id

Do not log secrets, raw verification evidence or unnecessary private message content.

## 17. Failure behavior

Authorization dependencies fail closed for protected operations unless a documented, risk-reviewed exception exists.

Observability distinguishes:
- explicit policy deny,
- invalid request,
- dependency unavailable,
- evaluation error.

A dependency outage must not silently convert into authorization success.

## 18. Policy versioning

Policies and deployment configuration affecting access are versioned.

Each decision should be traceable to the applicable policy/configuration version where operationally feasible.

Policy rollout must support:
- validation,
- staged publication,
- rollback,
- audit of effective version.

## 19. Initial interface

Conceptual interface:

evaluate({
  subject,
  capability,
  resource,
  context
}) → {
  effect,
  reasonCode,
  obligations,
  policyReference
}

This interface remains implementation-neutral and can be exposed internally through application code before any networked authorization service exists.

## 20. Security invariants

1. No client-side authorization is authoritative.
2. Paid status never bypasses safety restrictions.
3. Verification evidence is not exposed to feature modules.
4. Resource ownership is checked server-side.
5. Deny precedence is explicit.
6. Cache invalidation is part of enforcement design.
7. Administrative privilege is scoped and auditable.
8. Policy changes are versioned.
9. Authorization failure never silently becomes allow.

## Exact next step
Create API_ARCHITECTURE.md defining API boundaries, resource conventions, versioning, authentication flow, error contracts, idempotency and client compatibility.
