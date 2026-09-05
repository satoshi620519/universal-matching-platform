# Phase 12 Progress

## Checkpoint — User Block persistence boundary

- Branch: `phase12-safety-core`
- PR: #25 (`feat(safety): add report intake and moderation queue`)
- Scope selected: first Phase 12 gap, directed User Block.
- Existing Safety/Moderation infrastructure remains canonical; no duplicate moderation subsystem was introduced.
- Added `packages/domain/src/user-block.ts` with normalized directed block contract and invariants.
- Added focused domain tests and exported the contract from `packages/domain/src/index.ts`.
- Added PostgreSQL migration `20260904000500_create_user_blocks` with a composite primary key, account foreign keys, self-block CHECK constraint, and blocked-account index.
- Added `UserBlockRepository` application boundary and `PrismaUserBlockRepository` using parameterized SQL against the migration-owned table.
- Added `UserBlockDiscoveryExclusionPolicy` as the prepared adapter for the existing discovery block seam.
- The adapter is intentionally not registered yet because `AppModule` currently exposes one unqualified `DiscoveryExclusionPolicy` provider for both constructor slots. Do not silently change that wiring or create duplicate safety providers; wire the block/safety policies explicitly as the next integration slice.
- The temporary explicit-token experiment was reverted so the branch remains compatible with the existing module wiring while CI validates the persistence slice.

### CI evidence
- Commit `5d8488ff1b588528df1eee616d14eb83684392ea` has CI run `33857029823` (run #2843), currently `in_progress`.
- Matching Concurrency Gate run `33857029812` is currently `pending`.
- Therefore no green result is claimed yet.

### Commits
- `e1ef1f34074674e6354edf105ef8edda33fc4b98` — user block domain contract
- `8826822f5916bdf2c51907136ac219de9fdd87fe` — domain tests
- `6bd9ea68295916d903938c5ff13c86ac96513d82` — domain export
- `b70c322cc43ba45a93de18646be19e3331a2a418` — durable Phase 12 checkpoint
- `6b197d510932b047a18d7395a7db585a75173e45` — user block migration
- `4045e23f7e25c44a92faa3ca652be2ddd7a68a42` — repository boundary
- `14618582b6391288498d087ed0f3b803feb95f01` — Prisma repository
- `a23a529b18afee3dc136ba43feba73e08ffc07c2` — discovery adapter
- `d8a230c5b21bee01eee71e5baff8b4e37578677d` — restore compatible discovery wiring

### Remaining User Block work
1. Verify CI for persistence + discovery wiring.
2. Add repository/application tests, including duplicate-block and removal semantics.
3. Add authenticated HTTP block/unblock surface.
4. Add audit and focused integration coverage.

### Exact next action
CI #2855 and Matching Concurrency Gate #596 are green. Persistent User Block is now wired into Discovery through an explicit named policy pair, keeping the existing safety policy independent. Block enforcement is now also applied at matching transitions and conversation creation boundaries (including mutual-match conversation creation). Next action: add authenticated HTTP block/unblock surface and focused tests.

Do not implement ban, evidence/context, rate/spam controls, or moderation queue UI until the User Block persistence/enforcement boundary is established.


## Session checkpoint — 2026-09-04

### Completed in this session
- Verified CI #2855 and Matching Concurrency Gate #596 as successful before continuing integration.
- Wired persistent User Block into Discovery using an explicit block/safety exclusion-policy pair.
- Registered UserBlockRepository -> PrismaUserBlockRepository in the application module.
- Applied bidirectional block checks at Matching transition boundaries.
- Applied bidirectional block checks at Messaging conversation-creation boundaries, including mutual-match direct conversation creation.
- Kept the pre-existing Safety Restriction / Moderation architecture canonical; no duplicate safety subsystem was introduced.

### Current exact state
User Block is implemented across: domain contract, PostgreSQL persistence, repository, Discovery exclusion, Matching rejection, and Messaging/conversation rejection.

### Not yet completed (do next, in this order)
1. Run CI for the completed User Block slice and fix only concrete failures.
2. Add any missing focused tests: duplicate block idempotency, directed unblock semantics, self-block rejection, and bidirectional enforcement in discovery/matching/messaging.
3. Run CI and fix only concrete failures.
4. Add audit coverage where the existing canonical audit mechanism supports User Block actions.

### Important continuation rules
- Continue on branch: phase12-safety-core
- Existing PR: #25
- Do NOT recreate existing SafetyModeration, SafetyReport, SafetyEnforcement, or EffectiveSafetyRestriction infrastructure.
- Do NOT start Ban, Evidence/Context, Rate Limit/Spam, or Moderation Queue UI before User Block is fully verified.
- Prefer existing repository/controller/auth/audit patterns.
- Inspect current file state before implementation.

### Latest commits for this session
- e5915fccc371c59be5be4407c48300c7dc488c2d — matching block enforcement
- 4400fa93153b966f980878b57d5345ee827153e5 — messaging block enforcement
- 45f5e4cdef55af0c137c2a84e5756cd0a8d80ede — progress update

### Exact first action tomorrow
Authenticated Block / Unblock API has been added using the existing RequestPrincipalResolver convention. Next: add focused tests, then run CI. Do not modify Discovery/Matching/Messaging again unless tests expose a concrete defect.


## Continuation update — 2026-09-05
- Inspected current authenticated controller convention (RequestPrincipalResolver + Authorization header + request ID).
- Added UserBlockController: POST /blocks/:accountId and DELETE /blocks/:accountId.
- Registered UserBlockController in AppModule.
- Authentication is resolved server-side; blocker identity is never accepted from the request body.
- Controller tests are now added and the unblock endpoint returns a proper NotFoundException instead of embedding a status code in a success payload. Next exact action: run CI for the completed User Block slice and fix only concrete failures.


## CI diagnostic checkpoint — 2026-09-05
- CI #2884 failed at Typecheck, before lint/test/build.
- Exact cause: DiscoveryService constructor was changed to an explicit `{ block, safety }` exclusion-policy pair, but `discovery.service.test.ts` still instantiated the old positional exclusion mocks.
- Fixed only those stale test constructor calls in commit `056ef01e7a2194155dc10fe46c021816ee996e79`.
- Matching Concurrency Gate #611 was still running at the time of diagnosis.
- Next exact action: verify CI triggered by `056ef01...`; do not change unrelated User Block code unless a new concrete diagnostic appears.


## CI diagnostic checkpoint — 2026-09-05 (integration DI)
- CI #2884: Typecheck and Lint passed; 144 test files passed, but HTTP application integration failed.
- Exact runtime error: Nest could not resolve DiscoveryService argument index 0 because DiscoveryProfileRepository is a type-only domain contract and therefore has no runtime injection token.
- Focused fix: explicitly inject the existing `DISCOVERY_PROFILE_REPOSITORY` provider token in DiscoveryService (commit d3de4e6e204e8c2a9cf2fc7419764dfddfd15b88).
- Matching Concurrency Gate #611 passed.
- Next exact action: verify CI for d3de4e6e...; do not modify unrelated User Block scope unless a concrete diagnostic appears.


## CI diagnostic checkpoint — 2026-09-05 (provider registration)
- CI for d3de4e6e... still failed only at the two HTTP application integration tests.
- Typecheck/Lint passed and Matching Concurrency Gate passed.
- The previous fix correctly added @Inject('DISCOVERY_PROFILE_REPOSITORY') to DiscoveryService, but AppModule did not yet register that token.
- Focused provider registration added: DISCOVERY_PROFILE_REPOSITORY -> PrismaDiscoveryProfileRepository (commit a26cd6f663959d79cae437bc58a30819c468bfc9).
- Next exact action: verify CI for a26cd6f...; do not change unrelated scope unless diagnostics identify another concrete issue.


## User Block verification checkpoint — 2026-09-05
- CI for commit a26cd6f663959d79cae437bc58a30819c468bfc9 is fully green.
- Passed: migration verification, PostgreSQL migration integration, Typecheck, Lint, Test, Matching concurrency integration, and Build.
- Matching Concurrency Gate is also green.
- User Block vertical slice is now verified end-to-end across persistence, discovery, matching, messaging, authenticated API, and controller coverage.
- Audit infrastructure was searched for before adding scope; no existing canonical audit mechanism was found in apps/api/src, so no parallel audit subsystem was introduced.
- Next exact action: inspect existing Phase 12 roadmap and choose the next smallest canonical safety slice; do not reopen User Block unless a concrete regression is reported.


## Phase 12 next-slice decision — 2026-09-05
- User Block is fully CI verified and frozen as a completed vertical slice.
- Reviewed MASTER_DEVELOPMENT_ROADMAP.md Phase 12 and selected Reporting as the next canonical slice because it follows directly after block and enables later moderation actions/queue without coupling them prematurely.
- Added SAFETY_AND_MODERATION_SPEC.md before coding, defining scope, invariants, minimal data model, lifecycle, and explicit boundary.
- Next exact action: inspect existing domain/database migration conventions and implement the Reporting slice starting with domain contracts and persistence; do not build queue/admin UI yet.


## Reporting implementation checkpoint — 2026-09-05
- Inspection found Reporting was not absent: canonical domain/report and SafetyReport persistence already existed.
- Avoided duplicating tables/repos. Aligned the existing report domain with the Phase 12 spec instead.
- Lifecycle updated to: submitted -> triaged -> actioned | dismissed.
- Added invariant validation: reporter/target required, reason required, self-report prohibited for user targets.
- Persistence create path now enforces the canonical domain invariant.
- Next exact action: inspect existing report API/application surfaces and add authenticated submission only where missing; then add focused transition/invariant tests and run CI.


## Reporting API checkpoint — 2026-09-05
- Re-read the current progress log and inspected existing report/moderation code before changing anything to avoid duplicate work.
- Found canonical SafetyModerationService already owns report submission and reporter listing; reused it instead of creating a parallel application service.
- Added SafetyReportController with authenticated POST /reports and GET /reports/me.
- Reporter identity is derived exclusively from RequestPrincipalResolver; request body cannot impersonate another reporter.
- Registered the controller in AppModule.
- Next exact action: inspect existing domain/service test conventions, add focused tests for report invariants, lifecycle transitions, authenticated controller identity, and then run CI.
- Continuation rule: do not reopen User Block or create duplicate report repository/service/controller paths unless a concrete regression requires it.


## Reporting test checkpoint — 2026-09-05
- Before testing, re-read PHASE12_PROGRESS.md and inspected existing report tests to avoid creating duplicates.
- Replaced the stale `closed` lifecycle expectations in the existing report domain test with the current canonical lifecycle and invariant coverage.
- Added SafetyReportController tests proving reporter identity comes from authentication and reporter listing is scoped to the authenticated account.
- Commits: 04499f34d5d21e18a4bfee6d6bcaeaaaafaf34f4 (domain tests), baea805bca4bb59983222071be035234e316fef2 (controller tests).
- Next exact action: run CI for the Reporting slice and fix only concrete diagnostics. Do not start moderation queue/admin UI while CI is unresolved.


## Reporting CI diagnostic checkpoint — 2026-09-05
- CI for 298ad9f... failed at Typecheck before lint/test/build.
- Exact diagnostic: SafetyModerationController still declared the obsolete ReportStatus value `closed` after the canonical lifecycle was changed.
- Focused fix in commit 1b4da4065621708afa39a3d0c8818a0c9908fe98: allowed moderation transition targets are now triaged, actioned, dismissed.
- No new subsystem or duplicate controller was introduced; existing moderation controller was aligned with the domain contract.
- Matching Concurrency Gate was still running during diagnosis.
- Next exact action: verify CI for 1b4da406... and fix only new concrete diagnostics. Keep Reporting scope frozen until CI is green.


## Reporting verification checkpoint — 2026-09-05
- CI for e2ffccd39f403d5f22014b8057796e9a60433fa0 is fully green.
- Passed: migration verification, PostgreSQL migration integration, Typecheck, Lint, Test, Matching concurrency integration, concurrency gate, and Build.
- Reporting slice is now CI verified: canonical domain invariants/lifecycle, persistence enforcement, authenticated submission/listing API, controller identity coverage, and regression coverage.
- Reporting implementation is frozen as a completed vertical slice; do not reopen it without a concrete regression.
- Next exact action: inspect the current Phase 12 roadmap/spec and existing moderation infrastructure to select the smallest missing canonical moderation slice. Check existing code first to avoid duplicating any moderation case/action functionality.


## Moderation actions verification checkpoint — 2026-09-05
- Re-read Phase 12 progress and inspected existing domain/enforcement infrastructure before coding; moderation actions and enforcement already existed and were not duplicated.
- Confirmed canonical action mapping: warning/close-without-action => none; feature restriction => feature-restricted; communication restriction => communication-restricted; suspend => suspended.
- Existing enforcement persistence already filters by status, effectiveAt, and expiresAt; domain activity logic already handles revoked/expired status.
- Updated existing moderation-action tests rather than creating a parallel suite, and extended existing safety-enforcement tests with the exact expiry-boundary invariant.
- Commits: cf62747c0fa696bd92ff797d349904e72edcc386, dc48e0b432b390084b2b3b917c92982c5f9f4184.
- Next exact action: run CI for these focused moderation-action verification changes. Fix only concrete diagnostics. Do not start moderation queue/admin UI or alter Reporting/User Block.


## Moderation actions verification complete — 2026-09-05
- CI for 788bf4f129246cbdcb40d71bed24d3dc75a9e624 is fully green.
- Passed: migration verification, PostgreSQL migration integration, Typecheck, Lint, Test, Matching concurrency integration, concurrency gate, and Build.
- Moderation action/enforcement invariants are verified, including canonical action mapping, enforcement/non-enforcement distinction, effectiveAt, exact expiry boundary, and revoked handling.
- Freeze Moderation Actions as a completed vertical slice; do not reopen without a concrete regression.
- Next exact action: inspect existing moderation queue/administration implementation and Phase 12 progress before selecting the smallest missing gap. Reuse existing moderation case/controller infrastructure where present; avoid parallel queue or admin subsystems.


## Moderation queue reconnaissance checkpoint — 2026-09-05
- Moderation Actions CI is fully green and frozen.
- Inspected existing SafetyModerationController/Service before adding the next slice.
- Existing admin operations already cover report transition, idempotent case opening, case transition, and action application with admin capability checks/audit records.
- No dedicated moderation queue listing endpoint or canonical moderation-case repository file was found at the inspected paths/searches.
- Next exact action: trace the existing SafetyReportRepository persistence contract for moderation-case storage/listing conventions, then add only the smallest admin queue read model/API needed for review. Do not duplicate case creation, transition, action, authorization, or audit logic.


## Moderation queue implementation checkpoint — 2026-09-05
- Re-read Phase 12 progress and traced the existing SafetyReportRepository/Prisma persistence before implementation.
- Added only the missing queue read path; reused existing report, moderation service, admin capability, authentication, and audit architecture.
- Repository boundary: listForModeration(status?, limit?) with bounded limit 1..100 and oldest-first deterministic ordering.
- Service boundary: listModerationQueue requires existing manage-moderation capability.
- API: GET /safety/moderation/reports with optional status=submitted|triaged and limit=1..100.
- No parallel queue table, case repository, admin subsystem, or UI was introduced.
- Next exact action: inspect existing controller/service/repository test conventions, add focused queue authorization/filter/order/bound tests, then run CI. Do not alter completed User Block, Reporting, or Moderation Actions slices.


## Moderation queue test checkpoint — 2026-09-05
- Re-read progress and searched for existing queue test coverage before adding tests; no dedicated queue tests existed.
- Added focused service tests: capability is required before reading, and authorization failure prevents repository access.
- Added focused controller tests: authenticated actor propagation, submitted/triaged filtering, and limit bounds 1..100.
- Commits: 799d1761619c192ea665446ea64b448312f29222, 20105b14318bc39c26acf24cd606fafbb61ae738.
- Next exact action: run CI for moderation queue slice and fix only concrete diagnostics. Do not expand queue features or reopen completed Phase 12 slices while CI is unresolved.


## Moderation queue CI diagnostic checkpoint — 2026-09-05
- CI for 95e4e10c4909a1ee90e773356278a1a37bab691f failed at Typecheck; Matching Concurrency Gate itself passed.
- Exact diagnostic: validated queue status was cast back to broad ReportStatus, but listModerationQueue accepts only submitted|triaged.
- Focused fix commit 20625b7e71787a52317ad1a0acb4ab123e501a13 narrows the controller value to the canonical queue status union after validation.
- No runtime behavior or subsystem was changed; this is a type-contract alignment only.
- Next exact action: verify CI for 20625b7e... and fix only concrete diagnostics. Keep Moderation Queue scope frozen until green.


## Moderation queue second CI diagnostic checkpoint — 2026-09-05
- CI for 20625b7e... still failed at Typecheck; Matching Concurrency Gate passed.
- Exact remaining diagnostic was on the validation expression itself: `includes()` was still receiving `status as ReportStatus`, which is broader than the submitted|triaged tuple.
- Focused fix commit 361ac57cfa47f99ec3913e787a3decf037ee3a21 narrows the validation argument to submitted|triaged, matching the already-narrow service call.
- No behavioral change; only the remaining TypeScript contract mismatch was removed.
- Next exact action: verify CI for 361ac57c...; if green, mark Moderation Queue complete and inspect only the next Phase 12 gap.


## Moderation queue verification complete — 2026-09-05
- CI for cd31e8060ab85000847f5723fde996439d051409 is fully green.
- Passed: migration verification, PostgreSQL migration integration, Typecheck, Lint, Test, Matching concurrency integration, concurrency gate, and Build.
- Moderation Queue is CI verified and frozen: authenticated admin access, manage-moderation authorization, canonical submitted/triaged filtering, bounded limit 1..100, deterministic oldest-first reads, and focused service/controller coverage.
- Next exact action: re-read Phase 12 roadmap/spec and inspect existing safety infrastructure for the next missing vertical slice. Do not reopen User Block, Reporting, Moderation Actions, or Moderation Queue without a concrete regression.


## Phase 12 next-slice decision — Evidence and context — 2026-09-05
- Moderation Queue is fully CI verified and frozen.
- Re-read the Phase 12 roadmap/spec and searched the repository before selecting new work.
- No existing canonical evidence/context capture, attachment model, rate/spam control, or ban-specific implementation was found in the inspected repository search.
- Selected Evidence and Context Capture as the smallest missing upstream moderation primitive.
- Scope is deliberately metadata/persistence first: no media-storage provider, upload pipeline, AI moderation, duplicate queue, or admin UI.
- Next exact action: inspect existing domain and Prisma migration conventions, then implement report evidence/context contracts and persistence with focused invariants before any API surface.


## Evidence and context domain checkpoint — 2026-09-05
- Re-read progress and inspected existing report/user-block domain conventions before implementation.
- Added canonical ReportEvidence domain contract with explicit kind, report linkage, normalized context/reference metadata, and capturedAt validation.
- Added focused domain invariant tests and exported the contract from the domain package.
- Scope remains metadata-only: no upload/storage provider or admin UI introduced.
- Commits: 7619dd3ee132ca4898f2b1c33f84b2fd504d3590, 30ac434dafdd2e456bea2632fddbd56a702fabf7, 3b5e8c912b2b95afe58b64b96a03fe17ec5b663c.
- Next exact action: inspect the concrete existing SafetyReport persistence/migration conventions from repository paths and add the smallest foreign-keyed evidence persistence boundary. Do not expose HTTP upload APIs before persistence is verified.


## Evidence persistence checkpoint — 2026-09-05
- Inspected the concrete SafetyReport Prisma model and existing repository conventions before persistence work.
- Added a single ReportEvidence persistence boundary and Prisma implementation; no parallel report repository was introduced.
- Added ReportEvidence -> SafetyReport foreign-key relation with cascade cleanup and deterministic chronological reads (capturedAt, id).
- Evidence remains metadata-only; storage/upload concerns are intentionally excluded.
- Commits: 431bc33f8c13d68ba3b741e70c47ec88d27c91e2, 598e93c4bd6dfcd0093f11a41c2ebca34aacdbd7, 603a53130ee2fe873b7fde0b8d3cc217fca9544d.
- Next exact action: inspect migration naming/history and add the matching PostgreSQL migration for report_evidence, then register the repository only where an existing DI token convention requires it. Add focused persistence tests before any HTTP API.


## Evidence migration and DI checkpoint — 2026-09-05
- Re-read current Phase 12 checkpoint and inspected concrete SafetyReport schema plus AppModule repository registration conventions.
- Added PostgreSQL migration `20260905001000_create_report_evidence` with report FK, cascade delete, and `(report_id, captured_at, id)` index matching the repository ordering contract.
- Registered PrismaReportEvidenceRepository through the canonical ReportEvidenceRepository DI boundary; no duplicate service/module was introduced.
- Scope remains persistence-only: no HTTP endpoint, upload/storage provider, or admin UI.
- Commits: ec73fceac0e0434ea56460bb5c1959159350b126, 4c3e47fb95e3cf46842ca93c655e75680e00490c.
- Next exact action: add focused repository tests for create/list deterministic ordering and report isolation, then run CI. Fix only concrete diagnostics before exposing any API.


## Evidence persistence test checkpoint — 2026-09-05
- Searched existing repository tests before adding coverage; no reusable Prisma safety repository spec pattern was found.
- Added focused PrismaReportEvidenceRepository tests for canonical metadata persistence and report-scoped deterministic chronological reads.
- Commit: d932cbd72f738597da436f3a8aa6ce472c79e7b7.
- Next exact action: run CI for this evidence persistence slice and fix only concrete diagnostics. Do not expose evidence HTTP APIs until persistence is green.


## Evidence persistence verification complete — 2026-09-05
- CI for 56c2142498e543750b4407d8497247dc4f496349 is fully green.
- Passed: migration packaging verification, PostgreSQL migration integration, Typecheck, Lint, Test, Matching concurrency integration/gate, and Build.
- Evidence persistence is CI verified and frozen: canonical domain invariants, SafetyReport FK with cascade cleanup, deterministic `(capturedAt, id)` ordering, DI registration, and focused repository coverage.
- Next exact action: inspect existing report creation/service/controller patterns and implement the smallest authenticated Evidence/Context capture write slice using the frozen persistence boundary. Do not add binary upload/storage or reopen completed slices without a concrete regression.


## Evidence capture write slice checkpoint — 2026-09-05
- Evidence persistence CI is fully green and frozen.
- Re-read existing report controller and moderation service patterns before exposing a write path.
- Added authenticated `POST /reports/:reportId/evidence` metadata capture; server generates evidence UUID.
- Ownership boundary: evidence capture first resolves the report and returns not-found when the authenticated reporter does not own it, avoiding cross-report evidence injection.
- Reuses canonical `createReportEvidence` invariants and frozen ReportEvidenceRepository; no upload/storage provider added.
- Commits: e9ad785e84c50c460567618b972440e61d59b03a, e0c5107bbacffd7cc8bbc6845ea90d11bd9bb8ad.
- Next exact action: inspect constructor/test fallout caused by the new repository dependency, add focused ownership/domain validation tests for capture, then run CI. Do not add binary attachments or retrieval/admin APIs before the write slice is green.


## Evidence capture focused test checkpoint — 2026-09-05
- Inspected existing report controller tests and searched for reusable moderation-service test coverage before adding tests.
- Updated controller mocks for the new moderation dependency and added authenticated identity propagation/server-generated evidence ID coverage.
- Added focused service tests for owner-only capture and indistinguishable not-found behavior for missing vs foreign reports; failed ownership never writes evidence.
- Commits: 6e00b151d8d1bf6f85cee51985a45cdb2bbfb9ba, e61aeec888782c584711b1eb60bd198b0e43936b.
- Next exact action: run CI for the evidence capture write slice, then fix only concrete diagnostics. Do not add evidence retrieval, admin views, or binary uploads before this slice is green.


## Evidence capture CI diagnostic checkpoint — 2026-09-05
- CI for dca4d877... failed at Typecheck only; failure was test-constructor fallout from adding ReportEvidenceRepository as the second SafetyModerationService dependency.
- Exact diagnostics: two queue specs and one authorization spec still instantiated the service with four arguments.
- Updated only those existing tests to inject the evidence placeholder in the canonical constructor position.
- No production behavior changed. Fix commits: 81f980f18a006391e53b368909a7c1b056dc1ea5, 2cb65d7fda5380589a09ce2ebd8752035c6318bd.
- Matching Concurrency Gate was still running independently at last check.
- Next exact action: verify CI for the latest fix and repair only concrete diagnostics; keep Evidence Capture scope frozen until green.


## Evidence capture write verification complete — 2026-09-05
- CI for 006615bab7d76f6c8125deac03056d5ffd35c775 is fully green.
- Passed: migration packaging verification, PostgreSQL migration integration, Typecheck, Lint, Test, Matching concurrency integration/gate, and Build.
- Evidence Capture Write Slice is CI verified and frozen: authenticated identity, server-generated evidence IDs, report-owner boundary with indistinguishable not-found behavior, canonical domain validation, and persistence reuse.
- Completed slices must not be reopened without a concrete regression.
- Next exact action: re-read Phase 12 roadmap/spec and inspect current safety infrastructure for the next missing vertical slice, prioritizing existing roadmap order and avoiding overlap with frozen Reporting, Moderation Queue, and Evidence Capture.


## Evidence Capture Write verification complete — 2026-09-05
- CI for 006615bab7d76f6c8125deac03056d5ffd35c775 is fully green.
- Passed: migration verification, PostgreSQL migration integration, Typecheck, Lint, Test, Matching concurrency integration/gate, and Build.
- Evidence Capture Write Slice is frozen: authenticated identity, server-generated evidence IDs, owner-only report boundary, canonical domain validation, and persistence reuse.

## Phase 12 next-slice decision — Ban semantics — 2026-09-05
- Re-read the roadmap/spec and current progress before selecting new work.
- Existing moderation actions infrastructure already supports warnings, restrictions, suspension and enforcement persistence; recreating it would be duplicate work.
- Selected the explicit remaining roadmap requirement: permanent/irreversible ban semantics.
- Next exact action: inspect existing SafetyEnforcement domain contracts, schema, and action-to-restriction mapping to identify the smallest concrete missing invariant before implementation.


## Ban semantics implementation checkpoint — 2026-09-05
- Inspected existing enforcement domain, persistence, effective restriction resolution, moderation action mapping, and controller before changing code.
- Found the enforcement model already supports permanent actions naturally via an active enforcement with no expiresAt; no new ban table or parallel subsystem was needed.
- Added only the missing canonical `ban` action and `banned` restriction mapping.
- Banned restrictions block all capabilities and resolve account state through the existing suspended safety boundary, preserving current account-state schema without a duplicate status model.
- Exposed `ban` through the existing canonical moderation action endpoint; administrative authorization and audit reuse remain unchanged.
- Commits: d5ac844a8786e0fb84014549cabb90e09b031488, cdfd2488751e03ed983e732b1d92818ac493e38f, 5d717e126797665d156899aa0484771c8e6f6e10.
- Next exact action: add focused domain/action and effective-restriction tests proving ban is permanent by default, blocks all scopes, and maps through the existing API; then run CI and fix only concrete diagnostics.


## Ban semantics focused test checkpoint — 2026-09-05
- Inspected existing domain and effective-restriction tests; extended those canonical tests instead of creating duplicate test suites.
- Added assertions that `ban -> banned`, ban is an enforcement action, banned blocks both general and communication scopes, and banned maps through the existing suspended account-state boundary.
- Commits: 5b80186af117bcea1e2aed94b4870e07da218f9e, e830381d8dba87ecb004eff887dce89e32ebe99c.
- Next exact action: run CI for the Ban semantics slice and fix only concrete diagnostics. If green, freeze the slice and re-read the Phase 12 roadmap before selecting another missing requirement.
