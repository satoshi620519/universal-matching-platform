# DEPENDENCY AND RELEASE HYGIENE

## Dependency policy
- Keep the pnpm lockfile authoritative and install with the repository's declared package manager version.
- Prefer reviewed, direct dependencies; avoid adding overlapping libraries for existing platform capabilities.
- Keep runtime dependencies separated from development tooling.
- Upgrade dependencies deliberately and validate the full CI gate after changes.

## Release hygiene
Before source-product distribution:
1. Install from the lockfile in a clean environment.
2. Run typecheck, lint, tests, matching concurrency integration, mobile acceptance, and build.
3. Verify packaged database migrations against PostgreSQL.
4. Review deployment configuration for placeholder secrets and production defaults.
5. Confirm no credentials, tokens, private keys, or local environment files are committed.
6. Review CHANGELOG, RELEASE_CHECKLIST, RELEASE_VERIFICATION, and SECURITY documentation.

## Known boundary
Automated vulnerability scanning can be added to CI when a chosen registry/audit service is available in the execution environment. It must not silently weaken the existing deterministic build gates or substitute network-dependent audit output for lockfile discipline.

## Phase 19 evidence
The repository already centralizes reproducible package-manager metadata, separates runtime/dev dependencies, and has executable release gates. This document makes the dependency and distribution responsibilities explicit for maintainers and source-product buyers.
