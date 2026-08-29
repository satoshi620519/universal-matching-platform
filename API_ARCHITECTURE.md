# API Architecture

## Status
Phase 2 architecture artifact — client contract baseline.

## Purpose
Define stable API boundaries and contracts shared by Web, iOS, Android and administration clients.

## Core principles
- API contracts are product interfaces, not database projections.
- Backend remains authoritative for authentication, authorization and state transitions.
- Resource models are versioned independently from internal persistence.
- Clients receive only data appropriate to their authorization and privacy scope.
- Breaking changes require explicit compatibility planning.

# 1. API boundary

Initial architecture uses a versioned HTTPS API backed by the application backend.

Client
  ↓ HTTPS
API boundary
  ↓
Authentication
  ↓
Authorization
  ↓
Application/domain services
  ↓
Transactional state + async publication

REST-style resource APIs are the initial default. Realtime and asynchronous interfaces are defined separately.

# 2. Versioning

Initial public application API namespace:

/api/v1/...

Rules:
- additive compatible fields do not require a major API version;
- renamed, removed or meaningfully changed fields require compatibility handling;
- clients must not depend on undocumented response fields;
- deprecation has a documented support window;
- API versioning is independent from database migrations.

# 3. Resource conventions

Prefer plural nouns for collections:

/accounts
/profiles
/categories
/matches
/conversations
/messages
/notifications
/entitlements
/verification-requests
/reports
/moderation-cases

Actions that represent meaningful domain commands may use explicit command endpoints where forcing CRUD would obscure invariants.

Examples:
/profiles/{id}/publish
/matches/{id}/end
/reports/{id}/withdraw

Command endpoints still follow authorization and idempotency requirements.

# 4. Request lifecycle

1. TLS termination
2. Request correlation identifier
3. Authentication
4. Structural validation
5. Authorization
6. Domain validation
7. Transaction/state mutation
8. Response construction
9. Domain event publication
10. Audit/observability

Sensitive operations may require stronger authentication or step-up assurance.

# 5. Authentication contract

Clients present an implementation-neutral authenticated session/token credential.

The API layer exposes authenticated subject context internally and avoids coupling domain handlers directly to provider-specific token claims.

Authentication endpoints and token/session mechanics are finalized during technology selection.

# 6. Authorization integration

Every protected endpoint maps to one or more stable capabilities.

Examples:

GET /profiles/{id}
→ profile.read with resource context

POST /conversations/{id}/messages
→ message.send with conversation context

POST /admin/moderation-cases/{id}/enforcement-actions
→ admin.enforcement.apply

Endpoint routing is never the sole authorization mechanism.

# 7. Response envelope

Successful responses should use predictable resource-oriented structures.

Errors use a stable machine-readable contract:

{
  "error": {
    "code": "STABLE_ERROR_CODE",
    "message": "Safe human-readable message",
    "details": []
  },
  "requestId": "..."
}

Rules:
- codes are stable contracts;
- messages may be localized;
- internal exceptions and safety intelligence are never exposed;
- requestId supports support and observability.

# 8. HTTP status principles

Use protocol semantics consistently:

200 successful retrieval/update
201 resource created
202 accepted for asynchronous processing
204 successful with no body
400 invalid request
401 unauthenticated
403 authenticated but unauthorized
404 resource unavailable/not visible
409 state or uniqueness conflict
422 semantically invalid command where adopted consistently
429 rate/usage limit
5xx server/dependency failure

Privacy-sensitive endpoints may intentionally avoid distinguishing nonexistent from inaccessible resources.

# 9. Validation

Validation occurs in layers:
- transport/schema validation;
- domain invariant validation;
- authorization-aware resource validation.

Never rely solely on client-side validation.

Validation errors identify safe fields/rules but must not expose hidden policy or sensitive resource information.

# 10. Pagination

Collection endpoints use cursor-based pagination for evolving/high-volume data.

Contract includes:
- items
- nextCursor when additional data exists

Cursor values are opaque.

Offset pagination may be acceptable only for bounded administrative/reference datasets where mutation consistency is not critical.

# 11. Filtering and sorting

Filtering and sorting are explicit allowlisted query parameters.

Do not expose generic database-field filtering.

Examples:
?category=...
?state=...
?sort=created_at_desc

Complex discovery queries should evolve through dedicated query contracts rather than uncontrolled parameter explosion.

# 12. Idempotency

State-changing operations vulnerable to retries support idempotency.

Clients send an idempotency key for eligible commands.

The server stores:
- authenticated subject scope
- operation identity
- request fingerprint where appropriate
- resulting response reference/status
- retention window

Same key must not silently execute a materially different operation.

Initial mandatory candidates:
- purchase confirmation handling
- externally retried commands
- message creation where duplicate delivery is possible
- high-impact administrative commands as appropriate

# 13. Concurrency

Use explicit concurrency control for mutable resources where lost updates matter.

Possible mechanisms:
- version/ETag style optimistic concurrency;
- conditional update;
- domain-specific state transition guards.

Never depend on last-write-wins silently for sensitive state such as enforcement, entitlement or configuration publication.

# 14. Partial updates

PATCH semantics must be explicitly defined per resource.

Avoid generic blind merge behavior for:
- safety state,
- entitlements,
- verification outcomes,
- policy configuration.

High-impact changes use explicit domain commands.

# 15. Resource visibility

Response shape and existence are authorization-aware.

Examples:
- private profiles expose different projections;
- moderation evidence is not returned to ordinary users;
- verification details expose outcome, not raw evidence.

A serializer/projection layer prevents accidental database-model exposure.

# 16. File and media APIs

Media upload uses a staged lifecycle:

1. request upload authorization
2. obtain constrained upload mechanism
3. upload to storage
4. processing/validation
5. attach approved media reference to domain resource

Long-lived public storage URLs are not treated as stable API data contracts.

# 17. Async operations

Operations exceeding normal request latency return an explicit asynchronous state.

Pattern:

POST command
→ 202 Accepted
→ operation reference
→ GET operation status or resource state

Clients must not infer success solely from background-job submission.

# 18. Rate and usage limits

Limits are enforced server-side.

Responses provide safe retry information where applicable.

Limit policies may depend on:
- capability,
- account trust state,
- entitlement,
- deployment configuration,
- abuse controls.

Rate limiting is defense-in-depth, not authorization replacement.

# 19. Web/mobile compatibility

The same semantic API contract serves Web, iOS and Android.

Client-specific convenience endpoints are allowed only when they do not fork business semantics.

Avoid embedding:
- web session assumptions,
- mobile-only business rules,
- UI copy as business authority.

# 20. Administration API

Administrative APIs use a separate route namespace, for example:

/api/v1/admin/...

They additionally require:
- scoped administrative capabilities;
- stronger audit coverage;
- careful pagination/filtering;
- restricted response projections.

Administration is not a hidden flag on consumer endpoints.

# 21. API documentation

Every production endpoint must eventually document:
- purpose;
- authentication requirement;
- capability requirement;
- request schema;
- response schema;
- error codes;
- idempotency behavior;
- rate-limit behavior where relevant.

An executable specification format is selected during implementation planning.

# 22. Compatibility testing

Contract changes require:
- schema validation;
- backward compatibility review;
- representative Web/mobile client tests;
- authorization projection tests.

# Security invariants

1. API responses never expose raw secrets.
2. Database entities are not automatically serialized.
3. Authorization occurs server-side.
4. Sensitive state changes are auditable.
5. Idempotency protects retry-prone operations.
6. Error responses do not reveal hidden resources or safety intelligence.
7. Breaking changes require explicit migration/deprecation planning.

# Exact next step
Create EVENT_AND_ASYNC_ARCHITECTURE.md defining domain-event publication, transactional outbox, background jobs, retries, dead-letter handling and consumer idempotency.
