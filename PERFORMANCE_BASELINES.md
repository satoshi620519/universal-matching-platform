# PERFORMANCE BASELINES

These are initial source-product acceptance targets, not production capacity claims. Measure p95 end-to-end API latency under a representative environment and attribute client, API, database, and third-party time where applicable.

| Critical journey | Initial p95 target | Primary dimensions |
| --- | ---: | --- |
| Authentication | 500 ms | client, api, database |
| Onboarding progression | 500 ms | client, api, database |
| Discovery retrieval | 750 ms | client, api, database |
| Matching action | 500 ms | api, database |
| Message sending | 500 ms | client, api, database |
| Protected capability check | 250 ms | api, database |

## Interpretation
A target breach is a measurement signal, not permission to bypass authorization, safety, transactional correctness, or observability. Diagnose the dominant dimension before changing infrastructure.

## Current hot-path findings
- Matching uses transaction-scoped PostgreSQL advisory locks for pair and idempotency serialization, then releases realtime publication outside the transaction.
- Discovery uses cursor pagination and fetches only limit + 1 rows, but distance filtering can require multiple pages; this is a measurable candidate for future database-side optimization when workload evidence exists.
- The default SSE publisher is process-local and intentionally suitable as a development/single-instance adapter, not a multi-instance fan-out guarantee.
