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
