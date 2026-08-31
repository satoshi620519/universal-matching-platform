# Email outbox standalone process adapter

The repository already provides PostgreSQL and Redis in local infrastructure, but
no queue framework or process supervisor is committed. The smallest grounded
execution adapter is therefore a standalone Nest application context that exits
after one bounded batch.

Run:

`pnpm --filter @universal/api email-outbox:run`

Optional configuration:

- `EMAIL_OUTBOX_BATCH_SIZE` — integer from 1 through 1000, default 100.

This adapter intentionally does not run inside the HTTP API bootstrap and does
not create an in-process timer. A scheduler, container orchestrator, cron
platform or queue consumer may invoke the command according to deployment
topology.

Each invocation emits a structured completion event containing processed count
and batch duration. The process delegates all claim, retry and stale-lock
semantics to EmailOutboxDispatchService through EmailOutboxWorker.

Because delivery remains at-least-once, a future real provider adapter should
supply provider idempotency identifiers before automated high-frequency
scheduling is introduced.
