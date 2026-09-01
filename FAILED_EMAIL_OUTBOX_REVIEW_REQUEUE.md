# Failed email outbox review and manual requeue

Terminal email failures are intentionally reviewable without being automatically
retried.

The application boundary provides two operations:

- list(limit): bounded inspection of terminal failed messages;
- requeue(id): guarded transition from failed back to pending.

The persistence requeue operation uses a status-qualified update. It succeeds
only when the message is still in the terminal failed state, preventing an
operator action from overwriting a concurrent delivery transition.

Requeue clears failedAt, lockedAt and the previous lastError and makes the
message immediately claimable. The durable message id is preserved, so provider
correlation remains stable across manual recovery.

This boundary deliberately does not expose a public HTTP administration endpoint
yet. Authentication, authorization, audit requirements and operator roles are
not sufficiently grounded for a production control surface.

Automatic replay of permanent failures remains disabled.
