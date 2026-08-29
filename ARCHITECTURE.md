# Architecture

## Status
Phase 2 integrated architecture blueprint.

## Purpose
This document is the implementation-level map connecting the approved Phase 2 artifacts. It does not replace their detailed contracts. Those documents remain authoritative for their respective concerns.

## 1. Product topology

Web (Next.js) ─┐
Mobile (React Native/Expo) ─┼→ Versioned API → Modular monolith
Admin (Next.js) ───────────┘                    ├→ PostgreSQL
                                                 ├→ Redis/cache/queues
                                                 ├→ Object storage
                                                 ├→ Background workers
                                                 └→ Realtime gateway

External payment, verification, messaging and notification providers are accessed through replaceable adapters.

## 2. Implementation structure

Initial monorepo target:
- apps/web
- apps/mobile
- apps/admin
- apps/api
- apps/worker
- packages/domain
- packages/api-client
- packages/config
- packages/types
- packages/ui
- packages/i18n
- infrastructure
- docs

This structure supports shared contracts without forcing identical presentation layers.

## 3. Domain ownership

Business modules follow DOMAIN_MODEL.md bounded contexts:
Identity/Account, Profile, Category/Configuration, Geography/Localization, Discovery/Matching, Messaging, Notifications, Commerce/Entitlements, Identity Verification, Trust/Safety, Authorization, Administration/Audit, Analytics and Media.

Rules:
- each mutable concept has one authoritative owner;
- cross-module references use stable IDs/contracts;
- provider-specific payloads are translated at adapters;
- analytics and external side effects do not own transactional truth.

## 4. Transactional core

PostgreSQL is the authoritative transactional source of truth.

The logical relational baseline is DATA_MODEL_DRAFT.md.

Application requests execute:

Authenticate
→ validate
→ authorize
→ domain operation
→ database transaction
   ├ authoritative state
   └ outbox records
→ commit
→ response

Critical invariants remain synchronous.

## 5. Authorization

Every protected operation evaluates:

Subject + Action + Resource + Context → Decision

Authorization is centralized and server-side per AUTHORIZATION_ARCHITECTURE.md.

Safety restrictions and other hard denials take precedence over entitlements or ordinary feature access.

Clients may optimize UX but never become authorization authorities.

## 6. API boundary

All primary client mutations and reads use the versioned API contract:

/api/v1/...

API_ARCHITECTURE.md governs:
- resource conventions;
- versioning;
- error contracts;
- pagination;
- idempotency;
- concurrency;
- privacy-aware projections;
- administrative API separation.

The API contract is not a direct serialization of database tables.

## 7. Asynchronous processing

Committed domain changes produce outbox records transactionally.

Outbox publisher
→ durable transport/job execution
→ independent consumers

Consumers implement idempotency. Delivery is assumed at-least-once. Retries are bounded and exhausted work enters observable dead-letter handling.

EVENT_AND_ASYNC_ARCHITECTURE.md governs detailed behavior.

## 8. Realtime

Realtime distributes eligible committed changes to authorized connected clients.

Authoritative mutation path:
Client → API → transaction → outbox → async publication → realtime gateway

Realtime is not the only source of truth. Clients reconcile missed or uncertain state through HTTP APIs.

REALTIME_ARCHITECTURE.md governs connection lifecycle and subscription authorization.

## 9. Configuration

Configuration is typed, scoped, versioned and audited.

Platform defaults
→ deployment
→ region
→ category
→ feature/approved rollout
→ subject preference

Only settings explicitly supporting a scope may override less-specific values.

Safety invariants and secrets are outside ordinary purchaser configuration.

CONFIGURATION_ARCHITECTURE.md governs draft, validation, publication, rollback and runtime resolution.

## 10. Data and privacy boundaries

Sensitive classes receive dedicated handling:
- authentication credentials are not ordinary account data;
- raw identity evidence is isolated from general verification records;
- precise location is separate from public geographic scope;
- message/media access is policy-controlled;
- audit records are append-oriented and data-minimized;
- API and event projections expose only authorized fields.

Retention and deletion/anonymization policies remain implementation milestones tied to product requirements and compliance decisions.

## 11. Matching architecture

Matching is strategy-based rather than dating-specific.

Strategies may include:
- mutual selection;
- swipe/card interaction;
- search/filter discovery;
- rule/criteria matching;
- scoring;
- future recommendation models.

Configuration selects approved strategies and parameters; core safety and authorization rules cannot be configured away.

## 12. Provider boundary

External services are behind interfaces/adapters.

Initial provider categories:
- payments;
- identity verification;
- email/SMS/push;
- object storage;
- realtime infrastructure;
- search.

Core domain state stores provider-neutral references and authoritative outcomes rather than uncontrolled provider payload copies.

## 13. Observability and audit

Correlation identifiers flow across:
request → domain operation → outbox event → async work → downstream effects.

Operational telemetry must avoid unnecessary sensitive content.

Administrative and high-impact actions produce audit records.

## 14. Failure posture

- DB failure: no authoritative mutation/event.
- Publisher failure after commit: outbox recovery.
- Duplicate async delivery: consumer idempotency.
- Realtime outage: HTTP state remains authoritative.
- External provider outage: decoupled side effects retry where appropriate.
- Configuration failure: immutable known-good versions enable rollback.
- Authorization/safety change: live access can be revoked.

## 15. Implementation sequence

Phase 3 should implement vertical slices rather than attempting every module simultaneously:

1. Monorepo and shared contracts.
2. Core API runtime and database migration tooling.
3. Identity/account + authorization baseline.
4. Configuration resolution baseline.
5. Profile/category/geography vertical slice.
6. Discovery/matching.
7. Messaging + notifications + realtime.
8. Payments and entitlements.
9. Verification + trust/safety/moderation.
10. Admin, analytics, media and operational hardening.

Each milestone requires tests, documentation and DEVELOPMENT_STATUS.md updates.

## 16. Deliberately unresolved choices

The following remain provider/technology decisions, not blockers for this architecture:
- authentication provider/method;
- payment provider strategy;
- identity-verification provider;
- hosting topology;
- advanced search technology;
- physical realtime transport/provider;
- observability stack;
- monorepo tooling.

These must be selected through explicit decisions before implementation points that depend on them.

## Phase 2 completion criteria

Phase 2 is complete when:
- domain ownership is defined;
- relational model baseline exists;
- authorization architecture exists;
- API contracts are defined;
- async reliability model exists;
- realtime recovery/authorization model exists;
- configuration architecture exists;
- all artifacts are integrated here;
- status and continuity records identify the next implementation phase.

## Exact next step
Begin Phase 3 implementation planning: create IMPLEMENTATION_MILESTONES.md with dependency-ordered, testable vertical milestones and explicit completion gates before writing application code.
