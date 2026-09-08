# PERFORMANCE AND SCALE SPECIFICATION

## Purpose
Phase 20 defines measurable performance and scaling boundaries for the Universal Matching Platform without inventing premature infrastructure.

## Existing foundation
The repository already defines critical user journeys and validates that every journey has an explicit positive latency target through the domain performance contract.

## Performance dimensions
Measure and attribute latency across:
- client
- API
- database
- third-party dependencies

Critical journeys:
- authentication
- onboarding progression
- discovery retrieval
- matching action
- message sending
- protected capability check

## Scaling principles
- Keep application services horizontally replaceable where stateful infrastructure is externalized.
- Treat process-local implementations as development defaults, not implicit production scale guarantees.
- Add distributed caching, rate limiting, queues, or realtime fan-out only behind existing contracts and only when workload evidence justifies them.
- Preserve correctness and authorization under concurrent access before optimizing latency.

## Phase 20 acceptance
- [x] Existing critical-journey performance contract inventoried.
- [x] Baseline latency targets documented for every critical journey (PERFORMANCE_BASELINES.md).
- [x] Database/query hot-path audit completed (cursor pagination, limit+1 retrieval, transactional match serialization; distance filtering explicitly identified as evidence-triggered optimization candidate).
- [x] API latency and dependency attribution boundary documented (client/API/database/third-party dimensions and p95 baseline interpretation).
- [x] Concurrent matching/realtime behavior audited against scale assumptions (PostgreSQL advisory-lock correctness gate; process-local SSE explicitly bounded to single-instance semantics).
- [x] Media handling explicitly bounded until a secure storage pipeline exists (no speculative media pipeline added; see Phase 19 boundary).
- [x] Scaling strategy documented with replaceable infrastructure boundaries (application contracts retained; distributed fan-out/cache/queue introduced only behind contracts when workload evidence requires).
- [ ] Fresh CI validates demonstrated performance/scale changes.

## Non-goals
Do not add speculative Redis, CDN, queue, or load-testing infrastructure merely to claim scalability. Add concrete mechanisms only when repository evidence exposes a measurable gap.
