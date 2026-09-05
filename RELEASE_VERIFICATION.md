# Release Verification Matrix

This matrix distinguishes checks already enforced by repository CI from checks that still require a real clean-environment release verification.

## Automatically enforced in CI
- Packaged database migrations build verification
- PostgreSQL migration command integration
- Typecheck
- Lint
- Test suite
- Matching concurrency integration gate
- Production build

## Manual release verification required
- Fresh machine or disposable environment
- Docker Compose PostgreSQL and Redis startup
- `pnpm install --no-frozen-lockfile` (current repository has no committed lockfile)
- Clean database migration using the buyer installation path
- Web and Admin startup
- API runtime startup through a documented entrypoint (currently unavailable; release blocker)
- Admin Quick Launch draft save/reload
- Complete all 11 configuration steps
- Publish configuration and verify immutable history
- Archive/package inspection for accidental `.env`, credentials, caches and databases

## Evidence record
For each marketplace release, record:
- release version
- commit SHA
- verifier environment
- exact command results
- CI run URL/identifier
- unresolved exceptions (must be empty for release)

A green CI run is necessary but does not replace the clean-environment verification above.
