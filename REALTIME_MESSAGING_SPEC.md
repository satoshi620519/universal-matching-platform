# REAL-TIME MESSAGING SPEC

## Scope
Phase 10 introduces conversations and messages without weakening existing safety, authorization, privacy, or moderation boundaries.

## Core entities
- Conversation: stable container for two or more authorized participants.
- ConversationParticipant: membership and per-participant read state.
- Message: immutable sender identity, server timestamp, typed payload, moderation/deletion state.
- MessageMedia: metadata/reference only; storage authorization remains outside message delivery.

## Authorization invariants
1. Server derives sender from authenticated principal; clients never supply sender identity.
2. Only active participants may read or send.
3. Blocked relationships prevent new message delivery and real-time events.
4. Reporting references durable message/conversation identifiers and preserves required moderation context.
5. Read receipts and typing state are visible only to authorized participants.

## Delivery model
- REST provides durable create/read/history semantics.
- A replaceable real-time gateway publishes authorized events after durable state transitions.
- Events are idempotent by message identifier and must tolerate reconnect/replay.
- Delivery acknowledgement is not equivalent to persistence acknowledgement.

## Message lifecycle
draft input -> server validation -> authorization/safety/block checks -> durable persistence -> transaction commit -> publish event -> recipient clients.

Deletion is a policy-driven state transition, not a blind physical delete. Audit/moderation retention requirements take precedence.

## Initial event vocabulary
- message.created
- message.deleted
- conversation.read
- conversation.typing

Typing state is ephemeral and never required for durable correctness.

## Media
Media messages reference an existing authorized media object. Upload security, scanning, and storage policy are not bypassed by messaging.

## Scale boundary
Gateway fan-out must remain replaceable. The domain/service layer cannot depend directly on a specific WebSocket provider. Horizontal scale may use a broker/adapter in Phase 20.

## Phase 10 acceptance criteria
- Conversation membership authorization
- Durable message creation/history
- Read state
- Authorized real-time event boundary
- Optional typing state
- Media reference boundary
- Block integration
- Report integration
- Policy-driven deletion
- Regression tests for authorization and safety invariants
