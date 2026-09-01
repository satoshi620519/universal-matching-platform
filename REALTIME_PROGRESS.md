# Realtime Progress

## 2026-09-01 checkpoint

- CI #1150: success — post-commit message publication.
- CI #1151: success — progress checkpoint.
- CI #1156: success — SSE implementation baseline (typecheck, lint, test, concurrency integration, build).
- CI #1157: success — SSE transport checkpoint.
- CI #1160: success — SSE accessor regression fix and full build verification.
- CI #1161: success — HTTP-authoritative reconnect/reconciliation contract.
- CI #1162: success — reconnect/reconciliation checkpoint.
- CI #1163: success — SSE lifecycle/delivery contract.
- CI #1164: success — SSE lifecycle checkpoint.
- Existing repository audit found no WebSocket/SSE/gateway transport, so no transport was duplicated.
- Added provider-neutral `RealtimePublisher` and post-commit publication seam.
- Added minimal account-scoped SSE adapter using the existing NestJS + RxJS dependencies; no new transport dependency was introduced.
- Added authenticated `GET /realtime/events` SSE endpoint. Account identity is resolved from the authenticated request and the stream only receives events published to that account.
- Found and fixed a concrete SSE adapter defect: the public `streamFor()` accessor recursively called itself. The implementation now uses a private `getStream()` accessor, with a regression test.
- Added reconnect/reconciliation contract coverage: after an SSE disconnect, messages and notifications are recovered from the existing authenticated HTTP reads; realtime transport is not required for recovery.
- Durable database/HTTP state remains authoritative. Reconnect/reconciliation is intentionally not delegated to SSE.
- Added SSE lifecycle/delivery contract coverage for account isolation and same-account fan-out; no transport redesign was introduced.
- Found and fixed a concrete SSE controller lifecycle defect: the teardown returned from the authentication promise was not returned from the outer Observable, so an established subscription could remain active after client unsubscribe. The controller now retains and explicitly tears down the subscription, including the race where unsubscribe occurs before authentication resolves.
- Found and fixed a concrete SSE resource defect: idle account streams were retained indefinitely in the publisher map. The publisher now creates streams only for active subscriptions, deletes them when the last subscriber unsubscribes, and drops publications for accounts with no active stream.
- The SSE adapter is in-process only. No distributed broker or speculative multi-node coordination was added.
- Latest implementation checkpoint: `8afac594fd5b6be80ef81ddd1df088937dc432c9`.

## Next exact task

1. CI-validate the idle-stream cleanup fix.
2. If green, audit only remaining concrete realtime correctness/resource defects.
3. Do not add a broker, WebSocket stack, or alternate mutation path unless a concrete deployment requirement or test failure requires it.
