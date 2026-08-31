# Email outbox worker execution boundary

EmailOutboxWorker is intentionally an explicit execution boundary rather than an
automatic application-startup scheduler.

It exposes:

- runOnce(): process at most one currently claimable message.
- drain(maxMessages): process a bounded batch and stop when the outbox is empty
  or the configured bound is reached.

This makes queue/process infrastructure replaceable. A future deployment adapter
may invoke runOnce from a queue consumer, scheduled job, container worker, or
managed task service without changing application delivery semantics.

The worker does not bypass EmailOutboxDispatchService. Claiming, stale-lock
recovery, delivery, retry and backoff remain centralized in the dispatcher.

No automatic timer is started by AppModule. Running background loops inside API
startup would couple HTTP availability to an unchosen process topology and could
create duplicate workers during horizontal scaling.
