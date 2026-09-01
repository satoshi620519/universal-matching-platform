# Realtime Progress

## 2026-09-01 checkpoint

- CI #1150: success — post-commit message publication.
- CI #1151: success — progress checkpoint.
- Existing repository audit found no WebSocket/SSE/gateway transport, so no transport was duplicated.
- Added provider-neutral `RealtimePublisher` and post-commit publication seam.
- Added minimal account-scoped SSE adapter using the existing NestJS + RxJS dependencies; no new transport dependency was introduced.
- Added authenticated `GET /realtime/events` SSE endpoint. Account identity is resolved from the authenticated request and the stream only receives events published to that account.
- Durable database/HTTP state remains authoritative. Reconnect/reconciliation is intentionally not delegated to SSE; clients can re-read notifications/messages from the existing authenticated HTTP APIs.
- The SSE adapter is in-process only. No distributed broker or speculative multi-node coordination was added.
- Commits: c05fac1c726ca99a27ec7b0766d9abd29a5120f7, 5ce2078e106f89b070a8e6550457f73cded61d73, f4a51617b8b35f46594b727e1b8337e8b107d325, 99e5d9d90cf2e9d1b3fea65b812d87e6586ae642.

## Next exact task

1. CI-validate the SSE adapter/controller and fix only concrete failures.
2. If green, add reconnect/reconciliation contract tests against the existing notification/message HTTP reads.
3. Do not add a broker, WebSocket stack, or alternate mutation path unless a concrete deployment requirement or test failure requires it.
