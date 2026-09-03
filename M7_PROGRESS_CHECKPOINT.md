# M7 Progress Checkpoint

## Purpose
Track M7 only. Inspect this checkpoint and current `main` before every change to prevent duplicate work.

## Boundary inventory
- VerificationRequest / VerificationOutcome persistence already exists.
- Verification repository/service/access layers already exist.
- Domain verification lifecycle transition rules and usability evaluation are implemented.
- Entitlement domain state model already exists; no payment/webhook implementation was found in the current repository surface search.
- M6 is not to be reimplemented unless a concrete CI/test failure appears.

## Completed
- Verification lifecycle transition contract and tests added.
- Provider-independent verification request/result adapter boundary added at `apps/api/src/verification/verification-provider.ts`.
- Adapter contract tests added at `apps/api/src/verification/verification-provider.test.ts`.
- Provider-specific credentials/integration were intentionally not added; concrete providers must implement the boundary.
- Commits: `b99f8749d5bf6e8c4851f6422ea8c01ed1cfdd01`, `663c5bb27c51449d832c88fe7c56977a7afe2246`, `11e1f991206e1eb3938d732e2a7e5fff02f3ee3b`, `3576d1374e3ed482a0fb255cd18201ff1a00f50f`.

## CI
- CI `33709753353` for `663c5bb27c51449d832c88fe7c56977a7afe2246`: completed successfully; Test, Matching Concurrency integration, concurrency verification/artifact steps, and Build all succeeded.
- Matching Concurrency Gate `33709753448`: core PostgreSQL concurrency evidence, attestation, and evidence upload succeeded at last inspection.
- The new provider-boundary commits require fresh CI verification; no green result is inferred until that execution is observed.

## Next exact task
Verify the provider-boundary change through CI. If green, implement the smallest payment abstraction: provider-neutral payment intent/result contract, keeping provider credentials outside domain projections. Then add webhook idempotency and entitlement grant/revocation in dependency order. Update this checkpoint after every coherent slice and preserve `DEVELOPMENT_STATUS.md` historical content.
