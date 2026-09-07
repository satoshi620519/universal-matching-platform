# Phase 12 Messaging Block Enforcement Checkpoint

Date: 2026-09-07

## Verified
- Relationship-level `UserBlock` persistence and discovery exclusion already existed; no duplicate implementation was created.
- Matching already rejects both directional block states.
- Messaging conversation creation already rejected blocked participants.

## Concrete defect found
`POST /conversations/:conversationId/messages` checked account-wide communication restrictions but did not re-check the authoritative `UserBlockRepository` against the existing conversation participants.

This meant an existing conversation could remain usable for messaging after either participant subsequently blocked the other.

## Fix
- `MessagingController.createMessage` now resolves the authenticated participant's conversation first.
- It applies the same authoritative bidirectional `UserBlockRepository` check used by conversation creation.
- A blocked relationship is rejected before message persistence/realtime publication.
- Missing/non-participant conversations return 404 before attempting a message write.

## Regression test
Added a controller test proving that when the other participant has blocked the authenticated sender, an existing conversation cannot be used to create another message.

## Commits
- `9269a6a731a96f63bacaf716f80e39aa35759e70` — fix(messaging): enforce user blocks on existing conversations
- `f30f7ff2cac9fb5a1c395578e072839b9008f57b` — test(messaging): cover block enforcement on existing conversations

## Verification state
Code/test changes are committed to `main`. This environment does not execute the repository test suite, so no test pass is claimed without an actual runner result.

## Next exact task
Inspect realtime/message-publication paths for any bypass of the same block policy, then run the focused messaging test suite in an executable environment. Do not duplicate the already-complete UserBlock persistence or discovery work.
