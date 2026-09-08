# DEPENDENCY AND RELEASE HYGIENE

## Dependency policy
- The current repository has no committed pnpm lockfile. Until one is intentionally generated and validated, buyer verification must use the documented `pnpm install --no-frozen-lockfile` path and must not claim byte-for-byte dependency reproducibility.
- When a lockfile is intentionally introduced, make it authoritative and install with the repository's declared package manager version.
- Prefer reviewed, direct dependencies; avoid adding overlapping libraries for existing platform capabilities.
- Keep runtime dependencies separated from development tooling.
- Upgrade dependencies deliberately and validate the full CI gate after changes.

## Release hygiene
Before source-product distribution:
1. Install using the documented clean-environment command; do not claim lockfile reproducibility until a maintained lockfile exists.
2. Run typecheck, lint, tests, matching concurrency integration, mobile acceptance, and build.
3. Verify packaged database migrations against PostgreSQL.
4. Review deployment configuration for placeholder secrets and production defaults.
5. Confirm no credentials, tokens, private keys, or local environment files are committed.
6. Review CHANGELOG, RELEASE_CHECKLIST, RELEASE_VERIFICATION, and SECURITY documentation.

## Known boundary
Automated vulnerability scanning can be added to CI when a chosen registry/audit service is available in the execution environment. It must not silently weaken the existing deterministic build gates or substitute network-dependent audit output for lockfile discipline.

## Phase 19 evidence
The repository centralizes package-manager metadata, separates runtime/dev dependencies, and has executable release gates. Full dependency reproducibility remains an explicit release-quality limitation until a maintained lockfile is intentionally introduced. This document makes that boundary and the distribution responsibilities explicit for maintainers and source-product buyers.
