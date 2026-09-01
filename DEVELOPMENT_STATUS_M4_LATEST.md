# Milestone 4 — Latest Checkpoint

## Advisory-lock collision hardening
- Production matching repository used PostgreSQL `hashtext()` for both transaction-scoped advisory locks.
- `hashtext()` yields a 32-bit lock key. This is not a correctness failure by itself, but it creates a higher theoretical collision rate as the number of distinct pair/idempotency keys grows; collisions can cause unrelated requests to serialize unnecessarily.
- Replaced both lock expressions with `hashtextextended(..., 0)`, using PostgreSQL's 64-bit advisory-lock overload while preserving deterministic pair canonicalization and actor+idempotency lock strings.
- Updated the unit test to require `hashtextextended` for both transaction-scoped locks.

## Commits
- Implementation: `a79c561d5a08c8bb47dcff5f721ef1935cb12846`
- Test: `3426649c7468190062d30a93bd2ac3657f40daa1`

## Execution evidence state
- Actual PostgreSQL Workflow execution is still not observable through the available GitHub workflow-run integration; no green result is inferred.
- The final executable workflow provisions PostgreSQL 16, applies Prisma migrations, runs the isolated concurrency integration suite, preserves test exit status with `pipefail`, emits explicit PASS/FAIL attestation, and uploads a commit-addressable log artifact.
- The repository has no committed `pnpm-lock.yaml`, so the workflow intentionally uses `pnpm install --no-frozen-lockfile`; frozen-lockfile reproducibility is not claimed.

## Next exact task
1. Obtain an actual isolated PostgreSQL workflow execution or equivalent runner result.
2. Inspect Job Conclusion.
3. Inspect `MATCHING_CONCURRENCY_GATE=passed|failed` attestation and exact `EVIDENCE_COMMIT`.
4. Inspect `matching-concurrency-evidence-<sha>` artifact/log.
5. Record the real result before declaring Milestone 4 complete.

**Rule:** further implementation changes should be driven only by concrete execution failures, not by repeated speculative CI edits.
