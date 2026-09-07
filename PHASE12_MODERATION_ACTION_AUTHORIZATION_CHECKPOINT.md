# Phase 12 Safety / Trust / Moderation Checkpoint

## Current state

- Phase 12 Safety, Trust and Moderation remains in progress.
- M12.1 relationship blocking and persistence are already implemented; do not duplicate them.
- M12.2 messaging block enforcement was previously fixed for existing conversations and committed.
- M12.4 moderation lifecycle/authorization is tightened and has focused regression coverage.
- M12.3 report target typing/self-report protection is already present at controller/domain boundaries.
- M12.5 report abuse control now uses the existing `RequestRateLimiter` abstraction.

## Completed in recent work

- Added regression coverage for `SafetyModerationService.applyAction()` when the supplied moderation case does not exist.
- Added regression coverage when the moderation case is already `closed`.
- Added validation and regression coverage for moderation-case existence and legal status transitions before mutation.
- Audited the report endpoint and found that report submission had no abuse/rate-limit enforcement despite the existing `RequestRateLimiter` abstraction being wired globally.
- Added an authenticated per-account report-submission limit of 5 reports per 10 minutes. Requests over the limit return HTTP 429 before report validation/persistence.

## Relevant commits

- `20c91384e2f1247915e9a7cbfb4951ac459ad80c` — expose moderation case lookup by id
- `2ee1a05b57a581d840e587cf75d53e536f751f4e` — implement case lookup by id
- `9b4e72afba0062cdf237539a2a23cef9672e74e6` — authorize moderation actions against existing actionable cases
- `6f68b76e17861e46e64f4e9ca9f1ca42c6ad4706` — validate moderation case transitions before mutation
- `3ae19338f098b93ff6da84af7bf81030c8f3ccb2` — regression coverage for moderation case transition authorization
- `19754cfaa8cb466fa4d3f18d7c8554085a3bab4b` — rate limit authenticated report submissions

## Validation status

- Changes are committed to GitHub.
- Repository test execution has not been performed in this environment, so no test-pass claim is made.

## Next exact task

1. Add focused controller regression coverage for the report rate limit and preserve existing target-type/self-report validation behavior.
2. Audit remaining M12.5 abuse-sensitive endpoints for existing `RequestRateLimiter` integration, without introducing Redis solely for speculative scale.
3. Re-check M12.6 end-to-end authorization/regression coverage.
4. Re-audit realtime/message publication for any path that can bypass the authoritative block policy.
5. Preserve existing safety/report/moderation persistence and avoid reimplementation.
