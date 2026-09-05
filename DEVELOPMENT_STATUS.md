## Phase 13 account lookup privacy boundary — 2026-09-05
- Continued from the recorded AccountLookup review without re-auditing already protected admin surfaces.
- AccountLookupService returns only AccountRecord fields: id, status, createdAt, updatedAt; no email, credentials, profile details, tokens, or other secret fields are exposed by this DTO boundary.
- The endpoint was nevertheless unauthenticated and accepted arbitrary accountId, creating an unnecessary account-existence/status disclosure surface.
- Added the existing RequestPrincipalResolver authentication boundary before AccountLookupService is called. No new authorization system or data model was introduced.
- Added focused regression tests: unauthenticated lookup is rejected before repository/service access; authenticated lookup continues through the existing service.
- Commits: 27362b114f9305326b6e2812b7538fa82480ceae, 60edb5f395bf038797acb90011a7c1df9714d1e9.

## Phase 13 user-block discovery enforcement checkpoint — 2026-09-05
- Completed the remaining account/profile controller inventory needed for the current privacy boundary: ProfileService/PrismaProfileRepository are application/repository layers, while the externally exposed profile surface is ProfileDiscoveryController; no additional arbitrary profile lookup controller was found on the branch.
- No new non-public profile-field exposure was identified in this pass; profile persistence includes private location fields, so those must remain behind the existing projection/discovery boundary rather than being exposed directly.
- Confirmed DiscoveryService already consumes the explicit `DISCOVERY_EXCLUSION_POLICIES` token and evaluates the block policy before candidate projection; no duplicate DI implementation was introduced.
- Added focused regression coverage for UserBlockDiscoveryExclusionPolicy: subject blocks candidate, candidate blocks subject, and neither side blocked.
- Commit: 4796bdfbbfcba38051a354d692f848a58cb19950.
- Next exact action: add repository/application-level UserBlock tests for duplicate/create and remove semantics, then wire block enforcement into match/messaging boundaries only where a concrete bypass remains.

## Phase 13 user-block repository checkpoint — 2026-09-05
- Added focused PrismaUserBlockRepository regression coverage for normalized create success, duplicate insert -> ConflictException, remove true/false semantics, and exists true/false semantics.
- No repository implementation change was needed; the tests lock the current persistence contract in place.
- Commit: 11f8673d567bda0fb3e83411d269cda33614f098.
- Match and messaging boundaries were rechecked before any new enforcement work: both already perform bidirectional UserBlock checks, so no duplicate bypass patch was introduced.
- Next exact action: inspect the current test/build/CI evidence for these latest commits; only patch a concrete failure or missing boundary.
