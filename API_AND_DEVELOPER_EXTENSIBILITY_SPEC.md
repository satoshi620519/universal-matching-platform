# API AND DEVELOPER EXTENSIBILITY SPECIFICATION

## Purpose
Phase 18 defines stable customization boundaries for advanced buyers without requiring a fork or rewrite of the Universal Matching Platform core.

## Compatibility model
- Public HTTP APIs are versioned under `/api/v1` for newly introduced stable endpoints.
- Existing unversioned routes remain backward-compatible until an explicit migration/deprecation notice is published.
- Breaking changes require a new major API version; additive fields are preferred.
- Error responses retain the platform-wide error contract and correlation identifier behavior.

## Authentication
- Browser and first-party clients continue to use the existing authenticated session model.
- Extension integrations must authenticate through explicit adapters rather than accessing repositories directly.
- Secrets and provider credentials remain deployment configuration, never extension payload data.

## Extension boundaries
1. **Provider adapters** — replaceable infrastructure integrations such as payment, verification, email, notification and realtime delivery.
2. **Domain strategies** — replaceable matching and policy behavior through existing domain/service contracts.
3. **Outbound events** — verified domain events may be delivered to optional external consumers without exposing internal database models.
4. **Configuration** — deployment customization uses the existing configuration engine before source edits are required.

## Event delivery contract
An extension event must include:
- immutable event identifier
- event type
- schema version
- occurred-at timestamp
- correlation identifier when available
- minimal public payload

Delivery implementations must be replaceable, failure-isolated, and idempotency-aware. Consumers must not receive raw credentials or internal persistence objects.

## Non-goals
- Do not duplicate the existing payment webhook ingestion pipeline.
- Do not expose Prisma/database repositories as plugin APIs.
- Do not require a third-party plugin runtime for core deployments.
- Do not create speculative integrations without a stable extension contract.

## Phase 18 acceptance criteria
- [x] Existing API/auth/error/correlation boundaries inventoried.
- [x] Existing provider and webhook abstractions inventoried.
- [x] Compatibility and versioning policy documented.
- [x] Extension boundary rules documented.
- [x] Outbound extension event contract implemented with tests.
- [x] Developer documentation indexes supported extension points.
- [ ] CI validates Phase 18 additions without reopening passed gates.
