# Phase 12 Moderation Action Authorization Checkpoint

## Completed

- Re-read the current Phase 12 safety/moderation implementation before changing code.
- Confirmed report submission, report transitions, case opening, case transitions, SafetyEnforcement reuse, administrative authorization, and audit records already existed.
- Identified a concrete M12.4 lifecycle authorization gap: `applyAction` required the privileged capability but did not verify that the supplied `caseId` existed or was still actionable.
- Added `SafetyReportRepository.findCaseById` and its Prisma implementation.
- Updated `SafetyModerationService.applyAction` to reject missing moderation cases and reject actions against closed cases before creating enforcement or audit records.

## Commits

- `20c91384` — expose moderation case lookup for action authorization
- `2ee1a05b` — support moderation case lookup by id
- `9b4e72af` — authorize moderation actions against existing cases

## Verification boundary

- Source was inspected directly from GitHub before modification.
- Repository test execution has not been performed in this environment; no test pass is claimed.

## Next exact task

Add focused regression coverage for moderation action authorization (missing case and closed case must produce no enforcement/audit mutation), then inspect M12.3 report target lifecycle/duplicate-spam controls and M12.5 rate-limit integration. Do not duplicate existing SafetyReport, ModerationCase, SafetyEnforcement, or UserBlock persistence.
