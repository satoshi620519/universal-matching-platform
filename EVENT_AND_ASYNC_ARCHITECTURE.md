# Event and Async Architecture

## Status
Phase 2 architecture artifact — reliable asynchronous processing baseline.

## Purpose
Define how domain changes trigger asynchronous work without making the original transaction depend on notification providers, media processors, analytics pipelines or other slow/fallible consumers.

## Core principle
Transactional state is committed first. Asynchronous side effects are published reliably from committed state.

# 1. Architecture

Request
  ↓
Authentication / Authorization
  ↓
Domain operation
  ↓
Database transaction
  ├── authoritative state change
  └── outbox event record
          ↓
       commit
          ↓
    Outbox publisher
          ↓
   Event transport/queue
    ↙       ↓        ↘
Notifications Analytics Media/Search
    ↓        ↓        ↓
Independent consumers

The initial architecture does not require event sourcing. PostgreSQL remains the transactional source of truth.

# 2. Transactional outbox

A domain operation that produces an external side effect writes:
1. the authoritative state change;
2. one or more event records;

inside the same database transaction.

An event is eligible for publication only after commit.

Outbox record fields include:
- event_id
- event_type
- schema_version
- aggregate/reference type and id
- correlation_id
- causation_id where applicable
- occurred_at
- approved payload
- publication state/attempt metadata

# 3. Publication

A publisher continuously or periodically reads unpublished outbox records and sends them to the selected transport.

Publication must tolerate:
- process restart;
- temporary transport failure;
- duplicate delivery;
- delayed delivery.

The publisher marks completion only after the transport acknowledges according to the selected transport contract.

# 4. Delivery semantics

Initial assumption: at-least-once delivery.

Exactly-once distributed delivery is not assumed.

Therefore every consumer handling a business-relevant event must be idempotent.

# 5. Consumer idempotency

Consumers maintain a processed-event record or equivalent deterministic idempotency boundary.

Pattern:

Receive event
 ↓
Check event_id/idempotency boundary
 ↓
Already processed? → safe no-op
 ↓
Apply effect
 ↓
Record processed state
 ↓
Commit

An event retry must not create duplicate notifications, duplicate entitlements or repeated irreversible actions.

# 6. Event contract

Events contain only information required by consumers.

Do not publish:
- authentication secrets;
- raw verification evidence;
- unrestricted message bodies unless a tightly controlled consumer requires them;
- payment credentials;
- arbitrary copies of transactional rows.

Event payloads are versioned.

Consumers must tolerate additive compatible fields.

# 7. Event categories

## Domain events
Facts that occurred:
- ProfilePublished
- MatchCreated
- MessageCreated
- EntitlementActivated
- ReportSubmitted
- EnforcementApplied

## Integration events
Events explicitly shaped for an external subsystem.

A domain event does not automatically become a public integration contract.

## Operational events
Observability and lifecycle signals used for infrastructure operations.

Keep operational telemetry separate from business event semantics.

# 8. Background jobs

Jobs are appropriate for work that is:
- slow;
- retryable;
- scheduled;
- computationally expensive;
- dependent on external providers.

Examples:
- notification delivery;
- media processing;
- verification provider polling;
- search indexing;
- analytics aggregation;
- moderation automation;
- cleanup/anonymization jobs.

A job has explicit lifecycle metadata:

queued → running → succeeded
              ↘ failed → retrying
                         ↘ dead-lettered

# 9. Retry policy

Retries use bounded attempts and backoff with jitter.

Do not retry indefinitely.

Retry classification distinguishes:
- transient dependency failure;
- rate limiting;
- timeout;
- validation/permanent failure;
- authorization/configuration error.

Permanent failures bypass repeated retries and enter investigation/dead-letter handling where appropriate.

# 10. Dead-letter handling

After retry exhaustion, failed work enters a dead-letter state with:
- original event/job reference;
- failure classification;
- safe diagnostic metadata;
- attempt count;
- timestamps.

Dead-letter queues are operational workflows, not data graveyards.

Requirements:
- alerting;
- investigation tooling;
- controlled replay;
- replay idempotency.

# 11. Ordering

Global event ordering is not guaranteed.

Ordering requirements are defined per aggregate/consumer.

When strict order matters, consumers use:
- aggregate sequence/version;
- partitioning key;
- optimistic guards;
- reconciliation.

Consumers must not infer unrelated global order from timestamps.

# 12. Correlation and tracing

Every request receives or creates a correlation identifier.

Flow:

Request
 → domain operation
 → outbox event
 → async job
 → downstream operation

Causation identifiers link an event/job to the immediate triggering event.

This enables investigation without storing unnecessary user content.

# 13. Failure scenarios

## Database commit fails
No authoritative state change and no event is published.

## Commit succeeds, publisher crashes
Outbox record remains unpublished and is recovered.

## Event delivered twice
Consumer idempotency prevents duplicate effect.

## Consumer fails temporarily
Retry policy applies.

## Consumer repeatedly fails
Dead-letter workflow and alerting apply.

## Downstream provider outage
Core transaction may still succeed when the provider is not part of the synchronous invariant.

# 14. Synchronous invariants

Do not make a critical consistency requirement asynchronous merely for architectural fashion.

Examples potentially requiring synchronous handling:
- authorization before protected mutation;
- transactional uniqueness/state invariants;
- mandatory validation for a purchase acceptance boundary.

Async processing is for decoupled side effects, not a replacement for transactional correctness.

# 15. Event publication security

Event consumers authenticate with least privilege.

Topic/queue access is scoped by consumer responsibility.

Sensitive event classes may use separate transport permissions or omit sensitive payloads entirely.

# 16. Retention and replay

Outbox and processed-event retention periods are explicit.

Replay must consider:
- schema compatibility;
- consumer idempotency;
- historical policy changes;
- whether an event represents a fact or an instruction.

Never replay destructive instructions blindly.

# 17. Observability

Track at minimum:
- outbox backlog;
- publication latency;
- publication failures;
- consumer lag;
- retry counts;
- dead-letter count;
- processing latency;
- duplicate/idempotency hits.

Alerts focus on sustained failure/backlog rather than every transient retry.

# 18. Initial implementation guidance

Start simple:
- PostgreSQL outbox table;
- application worker/publisher;
- durable job transport selected with infrastructure stack;
- explicit event schemas;
- consumer idempotency table/boundary.

Do not introduce a distributed streaming platform unless scale and operational needs justify it.

# Security invariants

1. Uncommitted state never emits external events.
2. Consumers assume duplicate delivery.
3. Event payloads are data-minimized.
4. Retries are bounded.
5. Dead-letter items are observable and replay-controlled.
6. Async failures do not silently disappear.
7. Critical transactional invariants remain synchronous.

# Exact next step
Create REALTIME_ARCHITECTURE.md defining realtime connection lifecycle, event subscriptions, authorization, delivery guarantees, reconnection and fallback behavior.
