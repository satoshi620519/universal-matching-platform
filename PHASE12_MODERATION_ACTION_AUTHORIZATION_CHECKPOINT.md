# Phase 12 Safety / Trust / Moderation Checkpoint

## Current state

- Phase 12 Safety, Trust and Moderation remains in progress pending executable test validation.
- M12.1 relationship blocking and persistence are already implemented; do not duplicate them.
- M12.2 messaging block enforcement covers conversation creation and existing-conversation message sending before persistence/publication.
- M12.3 report target typing/self-report protection is already present at controller/domain boundaries.
- M12.4 moderation lifecycle/authorization is tightened with case existence, actionable-state, and legal-transition checks plus focused regression coverage.
- M12.5 report abuse control uses the existing `RequestRateLimiter` abstraction; no Redis dependency is being introduced for speculative scale.
- M12.6 controller/service authorization boundaries derive actor/reporter identity from the authenticated principal; no client-supplied actor identity is trusted.

## Completed in recent work

- Added regression coverage for `SafetyModerationService.applyAction()` when the supplied moderation case does not exist.
- Added regression coverage when the moderation case is already `closed`.
- Added validation and regression coverage for moderation-case existence and legal status transitions before mutation.
- Added an authenticated per-account report-submission limit of 5 reports per 10 minutes. Requests over the limit return HTTP 429 before report validation/persistence.
- Added focused controller regression coverage for report rate limiting, authenticated reporter identity, target validation, and moderation actor identity.
- Re-audited the messaging publication path: message creation performs authoritative participant/block checks before persistence, and the realtime publisher only publishes already-authorized created messages to supplied recipients; no independent message-send bypass was identified.
- Re-audited the existing `RequestRateLimiter` abstraction and did not find evidence requiring a second limiter implementation for Phase 12.

## Relevant commits

- `20c91384e2f1247915e9a7cbfb4951ac459ad80c` — expose moderation case lookup by id
- `2ee1a05b57a581d840e587cf75d53e536f751f4e` — implement case lookup by id
- `9b4e72afba0062cdf237539a2a23cef9672e74e6` — authorize moderation actions against existing actionable cases
- `6f68b76e17861e46e64f4e9ca9f1ca42c6ad4706` — validate moderation case transitions before mutation
- `3ae19338f098b93ff6da84af7bf81030c8f3ccb2` — regression coverage for moderation case transition authorization
- `19754cfaa8cb466fa4d3f18d7c8554085a3bab4b` — rate limit authenticated report submissions
- `a5e8a4b1e082fdaf1e1bf3abe3f29209ad31e7` — focused safety controller regression coverage

## Validation status

- Changes are committed to GitHub.
- Repository test execution has not been performed in this environment, so no test-pass claim is made.
- GitHub status/Actions results are not available for the current checkpoint, so Phase 12 is not marked fully validated yet.

## Next exact task

1. Execute the focused Phase 12 test suite when an executable repository environment is available.
2. Resolve only concrete failures found by execution.
3. If tests pass, mark M12.1-M12.6 validated and close Phase 12 without reimplementing existing safety infrastructure.
