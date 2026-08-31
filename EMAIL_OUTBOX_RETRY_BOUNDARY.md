# Durable email outbox and retry boundary

Registration no longer performs external email delivery synchronously.

The durable path is:

1. create the pending account and password identity;
2. enqueue an email-verification delivery intent;
3. a dispatcher atomically claims one pending message;
4. the dispatcher issues the short-lived verification token and invokes the
   outbound delivery boundary;
5. success marks the message delivered;
6. failure records a bounded error and reschedules with exponential backoff.

The outbox stores delivery intent and recipient metadata, not a raw verification
token. This keeps verification credentials out of durable message payloads.

The Prisma repository uses PostgreSQL row locking with SKIP LOCKED so concurrent
dispatchers do not intentionally process the same currently claimable row.

A crashed worker can leave a stale lock; claims older than five minutes become
eligible again. At-least-once delivery is therefore the current reliability
contract. Provider-level idempotency is not claimed yet.

No scheduler or process runner is introduced in this slice. EmailOutboxDispatchService
is the application boundary to be invoked by a future worker/queue adapter.
