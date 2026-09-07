# Phase 12 Messaging Block Enforcement Checkpoint

Date: 2026-09-07

## Verified authoritative implementation
- UserBlock persistence already exists on user_blocks.
- UserBlockRepository is the authoritative directional persistence boundary.
- Discovery exclusion checks both directions.
- Matching rejects both directional block states.
- Conversation creation rejects blocked participants.
- Existing conversation message creation re-checks both directions before persistence and realtime publication.

## Reconciliation performed
A parallel RelationshipBlock boundary had been started during continuation work. Repository inspection confirmed this duplicated existing UserBlock persistence and policy enforcement.

The duplicate AppModule registration was removed. No second migration was added. The existing user_blocks table and UserBlockRepository remain authoritative.

## Concrete messaging regression already fixed
Existing conversations are re-checked after a new block:
1. resolve the authenticated participant's conversation;
2. check authoritative bidirectional block policy;
3. reject before message persistence and realtime publication.

## Verification
Focused regression tests cover blocked existing conversations. This environment has not executed the repository test runner, so no unverified test-pass claim is made.

## Next exact task
Inspect realtime publication and notification paths for policy bypasses, then run the focused messaging test suite in an executable environment. Do not create another block persistence model or migration.


## 2026-09-07 integration correction
- AppModule was audited and corrected to register `UserBlockController`, `PrismaUserBlockRepository`, and `UserBlockDiscoveryExclusionPolicy`.
- DiscoveryExclusionPolicy now resolves to the authoritative user-block policy rather than the permissive AllowAll adapter.
- User block creation now honors the specification's idempotency requirement (`ON CONFLICT DO NOTHING` returns the requested block instead of surfacing a duplicate conflict).
