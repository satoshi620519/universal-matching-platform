# TESTING ACCEPTANCE

## Purpose

Phase 21 is the repository-level testing and release-readiness gate. This document records the minimum evidence required before Phase 21 can be accepted and prevents duplicate or speculative test infrastructure.

## Existing executable gates

The current CI already executes:

- packaged database migration verification
- PostgreSQL migration integration
- repository typecheck
- lint
- repository test suite
- matching concurrency integration
- mobile typecheck
- mobile tests
- mobile build
- repository build

The API package uses Vitest for its test command and exposes a dedicated matching-concurrency integration command.

## Phase 21 coverage lanes

| Lane | Existing evidence | Acceptance action |
| --- | --- | --- |
| Unit | Repository test suite + package-level Vitest tests | Preserve and close only demonstrated critical gaps |
| Integration/API | PostgreSQL migration and API integration tests | Verify critical API contracts and failure paths |
| Concurrency | Dedicated matching concurrency gate | Preserve as a release-blocking regression gate |
| Security | Phase 19 hardening and CI already accepted | Do not reopen without regression evidence |
| Mobile | Typecheck, test, build in CI | Keep equivalent acceptance for mobile changes |
| E2E | No dedicated E2E runner is established by the root package manifest | Introduce only if a critical user journey cannot be adequately verified by existing integration/API tests |
| Regression | Existing CI plus targeted feature tests | Convert discovered defects into permanent regression tests |
| Release | CI gates exist but no single Phase 21 checklist is the source of truth | Define release checklist before Phase 21 completion |

## Critical journeys for regression coverage

At minimum, release evidence must cover the core contract boundaries for:

1. authentication and protected access
2. onboarding/profile progression
3. discovery and filtering
4. interest/match transition and concurrent requests
5. messaging and realtime publication boundaries
6. reporting/blocking and moderation boundaries
7. administration authorization boundaries
8. account deletion/privacy boundaries
9. configuration publication/resolution

## Rules

1. Prefer extending an existing test file or harness over introducing a parallel framework.
2. Every new regression test must correspond to a real contract, defect, or release risk.
3. Do not weaken security, authorization, transactional correctness, or observability to make tests pass.
4. Do not claim E2E coverage merely because build or integration tests pass.
5. Phase 20 performance targets remain measurement contracts; they are not substitutes for functional tests.
6. A green CI run is required after any Phase 21 repository change.

## Next exact task

Inventory the existing tests by critical journey, identify concrete uncovered acceptance boundaries, add only the smallest high-value regression/integration tests needed, then run the complete CI gate and record the evidence in `DEVELOPMENT_STATUS.md`.
