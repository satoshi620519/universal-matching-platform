# Phase 12 Realtime Block-Policy Audit Checkpoint

Date: 2026-09-07

## Audit result
The realtime publication layer is not an authorization or mutation bypass.

- `MessageRealtimePublicationService` only publishes events to account IDs supplied by an already-authorized caller.
- Durable `message.created` publication occurs only after `MessagingController.createMessage` resolves participant membership and applies bidirectional `UserBlockRepository` checks.
- If either participant blocks the other, message persistence and subsequent realtime publication are rejected.
- Typing publication is an ephemeral transport primitive and does not create messages or independently resolve recipients; no separate public mutation endpoint was found in this audit slice.

## Boundary
Block authorization remains authoritative in the server mutation path. Realtime transport must not duplicate relationship-policy logic because duplicating it would create divergent authorization decisions.

## Next exact task
Continue Phase 12 acceptance audit from the remaining safety/moderation requirements: report evidence/context, moderation queue/action lifecycle, warning/suspension/ban enforcement, audit logs, and abuse/rate-limit boundaries. Reuse existing implementations where present.
