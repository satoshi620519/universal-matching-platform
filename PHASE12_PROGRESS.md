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
