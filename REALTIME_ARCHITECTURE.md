# Realtime Architecture

## Status
Phase 2 architecture artifact — realtime delivery baseline.

## Scope
Defines realtime behavior for messaging, match/status changes, notifications and other user-visible events. This document does not duplicate the asynchronous processing architecture; it consumes committed domain changes through explicit boundaries.

## Core principles
1. Realtime is an acceleration layer, not the sole source of truth.
2. Missing a transient realtime event must be recoverable through authoritative APIs.
3. Realtime authorization is server-side and continuously enforceable.
4. Delivery is best-effort/at-least-once unless a stronger contract is explicitly implemented.
5. Clients deduplicate and reconcile events.

# 1. Initial transport strategy

Use a WebSocket-capable realtime gateway abstraction. The application contract must not expose provider-specific semantics to domain modules.

HTTP APIs remain the fallback for:
- initial state loading;
- reconciliation after reconnect;
- history retrieval;
- operations requiring ordinary request/response semantics.

# 2. Connection lifecycle

Client
 → authenticate/connect
 → establish session context
 → subscribe to authorized channels/resources
 → receive events
 → heartbeat/health monitoring
 → reconnect on interruption
 → reconcile authoritative state

Connection establishment never grants permanent authorization. Authorization can be rechecked or invalidated during a live session.

# 3. Authentication

Realtime connections bind to an authenticated account/session context.

Rules:
- credentials are validated server-side;
- connection credentials have explicit expiry/refresh behavior;
- credentials are never embedded in public channel names;
- logout, suspension or critical credential invalidation terminates or deauthorizes active sessions promptly.

# 4. Subscription authorization

A client subscribes only to resources it is currently authorized to observe.

Examples:
- own notification stream;
- conversations where currently a participant;
- match state relevant to the account;
- scoped administrative queues.

Subscription checks call the same authorization vocabulary used by APIs.

A channel name is never proof of permission.

# 5. Event envelope

Realtime events use a stable envelope:

{
  "eventId": "...",
  "eventType": "...",
  "schemaVersion": 1,
  "occurredAt": "...",
  "resource": {
    "type": "...",
    "id": "..."
  },
  "correlationId": "...",
  "payload": {}
}

Payloads are minimized and authorization-aware.

# 6. Event categories

Initial candidates:
- message.created
- message.updated where supported
- conversation.updated
- match.created
- match.updated
- notification.created
- profile.visibility_changed where relevant to the current subject
- authorization.capabilities_changed when a client refresh is required

Do not broadcast internal moderation intelligence to consumer clients.

# 7. Delivery guarantees

Initial contract:
- events may be duplicated;
- events may arrive late;
- temporary disconnection may cause missed events;
- global ordering is not guaranteed.

Therefore clients must:
- deduplicate by eventId;
- use resource version/timestamp guards;
- reconcile through HTTP after reconnect or detected gaps.

The authoritative API/database state wins over a realtime payload.

# 8. Ordering

Ordering is meaningful primarily within a resource stream, such as a conversation.

Where ordering matters:
- include monotonic resource sequence/version where feasible;
- client rejects/regresses stale state;
- API reconciliation resolves uncertainty.

Do not assume timestamp order across unrelated resources.

# 9. Messaging flow

Client sends message through authoritative API:

POST /api/v1/conversations/{id}/messages
 ↓
Authorization + transaction
 ↓
Message persisted + outbox event
 ↓
Async publication
 ↓
Realtime gateway
 ↓
Authorized participants

Realtime transport does not become an alternate mutation path in Version 1.0.

# 10. Match and notification flow

Committed domain event
 ↓
Async processing
 ├─ create notification
 └─ publish eligible realtime signal
        ↓
   connected client

If the client is offline, durable notification/state retrieval remains available via API.

# 11. Reconnection and reconciliation

On reconnect:

1. authenticate connection;
2. restore authorized subscriptions;
3. optionally send last known cursors/versions;
4. receive supported catch-up events where available;
5. fetch authoritative deltas/state when required.

Clients must be able to recover even when event catch-up retention has expired.

# 12. Presence

Presence is optional and must not be treated as a privacy-neutral feature.

If implemented:
- presence has explicit user/privacy settings;
- stale connections expire quickly;
- presence is derived operational state, not durable truth;
- safety restrictions can suppress visibility.

Initial Version 1.0 should not make core matching correctness depend on presence.

# 13. Backpressure and limits

Realtime infrastructure enforces:
- maximum connections per account/device policy;
- subscription limits;
- event size limits;
- rate limits;
- slow-consumer handling.

A slow client may be disconnected and required to reconcile rather than allowing unbounded server memory growth.

# 14. Authorization changes during connection

High-impact changes invalidate active access promptly.

Examples:
- account suspension;
- block relationship affecting conversation visibility;
- participant removal;
- entitlement or verification change affecting a subscribed feature.

Mechanism may include:
- disconnect;
- subscription revocation;
- capability-change event followed by API revalidation.

Safety decisions take precedence over connection continuity.

# 15. Multi-device behavior

One account may have multiple authorized connections.

Events may reach several devices. Each device independently deduplicates and reconciles.

Read state and other shared mutable state remain authoritative API/domain operations rather than relying on socket delivery acknowledgment alone.

# 16. Fallback behavior

Every realtime feature defines an HTTP fallback.

Examples:
- missed message event → conversation history endpoint;
- missed match event → match list/state endpoint;
- missed notification → notification list endpoint.

No essential user state exists only inside an ephemeral socket event.

# 17. Observability

Monitor:
- active connections;
- authentication failures;
- subscription denials;
- disconnect reasons;
- reconnect rate;
- event delivery latency;
- slow consumers;
- reconciliation frequency;
- gateway backlog.

Do not log message bodies or sensitive payloads for ordinary connection telemetry.

# 18. Failure scenarios

Gateway outage:
- mutations continue through HTTP where dependencies permit;
- clients retry connection with backoff;
- authoritative state remains available.

Duplicate event:
- client deduplicates by eventId.

Missed event:
- reconnect/reconciliation restores state.

Unauthorized subscription attempt:
- deny and audit operationally as appropriate.

# 19. Implementation boundary

Initial implementation should introduce a provider-neutral RealtimePublisher/SubscriptionGateway interface.

Domain modules emit committed events; they do not directly manipulate WebSocket connections.

Physical provider selection is deferred to technology stack selection.

# Security invariants

1. Socket connection is not permanent authorization.
2. Channel names do not grant access.
3. Every subscription is server-authorized.
4. Sensitive events are minimized and scoped.
5. Realtime delivery never replaces authoritative state.
6. Safety changes can revoke live access.
7. Every critical realtime feature has HTTP recovery.

# Exact next step
Create CONFIGURATION_ARCHITECTURE.md defining deployment, category and feature configuration layers, precedence, versioning, publication, rollback and runtime resolution.
