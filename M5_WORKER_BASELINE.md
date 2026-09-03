# M5 Worker Baseline

## Status
Implemented baseline; integration with a concrete queue/database adapter remains a later M5 gate item.

## Why this change was needed
The repository already contained messaging, notification, realtime publication, and email outbox processing, but `apps/worker` had no executable worker source. The M5 plan explicitly requires a worker baseline, duplicate-event safety, and retry behavior.

## Implemented
- `apps/worker/src/outbox-worker.ts`
  - framework-neutral at-least-once processing contract;
  - explicit event-store claim/ack/retry boundary;
  - idempotency check before handler execution;
  - idempotency recorded before final event acknowledgement;
  - handler failures are released for retry and are never falsely marked processed;
  - validated batch size and retry limits;
  - capped exponential backoff helper (1s through 60s);
  - retry-limit helper.
- `apps/worker/src/outbox-worker.test.ts`
  - successful processing;
  - duplicate delivery suppression;
  - failure/retry behavior;
  - configuration validation;
  - backoff and retry-limit behavior.

## Commits
- `51df4678ccfc1914ff7a44757d3ffbda79d4d04b` — worker baseline
- `947ff77373d4dff4bc320efae02627108bdaaedf` — worker tests

## Exact next task
Connect this adapter boundary to the repository's persistent outbox/queue implementation and add an integration test proving retry after a worker failure, then verify missed realtime notification recovery through the API. Do not replace the existing messaging implementation.
