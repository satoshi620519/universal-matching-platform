# Matching concurrency integration test

This test is intentionally opt-in. Set `MATCHING_TEST_DATABASE_URL` to an isolated PostgreSQL database after applying the Prisma migrations.

It validates:
- concurrent duplicate requests do not create two directed interactions;
- concurrent reciprocal likes persist exactly two directed interactions;
- at least one transition observes mutual state after transactional completion.

The test must not run against production or shared development databases because it truncates `match_interactions`.
