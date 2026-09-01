# Milestone 4 Execution Checkpoint

Date: 2026-09-01

- Dedicated Matching Concurrency Gate is configured with PostgreSQL 16, explicit pass/fail attestation, commit-addressable evidence artifact, failure-preserving `pipefail`, and complete repository-input path triggers.
- Latest workflow hardening commit: `55e030f02a769f544a7a33cbc9ed843314c1bebc`.
- Added workflow-level concurrency serialization so matching evidence runs for the same ref do not overlap or cancel each other.
- The available GitHub integration does not expose a direct workflow-dispatch action. A path-triggered execution is therefore required for actual M4 evidence; no pass is inferred until its job conclusion, attestation, and `matching-concurrency.log` artifact are inspected.
- Do not modify the matching concurrency implementation speculatively while execution evidence is pending. Fix only concrete failures from the isolated PostgreSQL run.

## Concrete CI failures captured from run 33471968043
- Matching concurrency integration itself passed: 4 PostgreSQL tests passed, migrations applied, and `MATCHING_CONCURRENCY_GATE=passed` was emitted.
- The same CI run exposed two unrelated repository regressions that block the overall CI: `@universal/domain` typecheck/lint/build fail because `ConfigurationSettingDefinition` is exported from both configuration modules; `@universal/database` has a failing filesystem migration test because regular non-SQL files were silently ignored instead of rejected.
- Fixed the domain barrel collision by exporting the draft configuration definition under the explicit `DraftConfigurationSettingDefinition` name while retaining the resolution definition as `ConfigurationSettingDefinition`.
- Fixed filesystem migration loading to reject regular files that do not use the `.sql` migration contract while continuing to ignore nested directories.
- Fix commits: `bbab0b10ebaeeb8e37aaac5b76cac51006b016b2`, `1bbfb3523cbf919944047d22fb65200a2f0aeb7f`.
- Next exact task: run the normal CI on these concrete fixes, then obtain/inspect a path-triggered dedicated Matching Concurrency Gate run for the final M4 evidence. No green status is inferred for the new commits until execution is observed.
