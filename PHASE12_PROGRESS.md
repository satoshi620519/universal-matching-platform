# Phase 12 Progress

## Checkpoint — User Block domain foundation

- Branch: `phase12-safety-core`
- PR: #25 (`feat(safety): add report intake and moderation queue`)
- Scope selected: first Phase 12 gap, directed User Block.
- Reused existing safety/discovery exclusion architecture; no messaging-local block list or duplicate moderation subsystem was introduced.
- Added `packages/domain/src/user-block.ts` with a normalized directed block contract and invariants:
  - blocker and blocked account IDs are required;
  - self-blocking is rejected;
  - creation timestamp is normalized to an ISO instant.
- Added focused domain tests for normalization, required IDs, self-block rejection, and invalid timestamps.
- Exported the contract from `packages/domain/src/index.ts`.

### Evidence
- Repository audit confirmed the existing `DiscoveryExclusionPolicy` already has an explicit `block` dependency seam, currently backed by allow-all behavior; this is the correct integration point for the eventual persistent block adapter.
- Existing `SafetyReport`/`ModerationCase`/`SafetyEnforcement` infrastructure remains canonical and is not duplicated.
- CI workflow lookup for commit `6bd9ea68295916d903938c5ff13c86ac96513d82` currently returns no PR-triggered run through the available GitHub integration. This is **not** treated as green evidence.

### Commits
- `e1ef1f34074674e6354edf105ef8edda33fc4b98` — user block domain contract
- `8826822f5916bdf2c51907136ac219de9fdd87fe` — domain tests
- `6bd9ea68295916d903938c5ff13c86ac96513d82` — domain export

### Remaining User Block work
1. Persistent directed block relation and database constraint.
2. Repository/application operation with idempotent semantics.
3. Discovery exclusion adapter.
4. Match/messaging enforcement integration.
5. Authenticated HTTP block/unblock surface.
6. Audit and focused integration coverage.

### Exact next action
Validate the domain foundation through the existing CI workflow when a run becomes observable. If validation is green, implement the persistent block relation and repository boundary as the next isolated slice. If validation fails, fix only the exact reported diagnostic before proceeding.

Do not implement ban, evidence/context, rate/spam controls, or moderation queue UI until the User Block persistence/enforcement boundary is established.
