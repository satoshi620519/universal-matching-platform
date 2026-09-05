# Release Checklist

Use this checklist to decide whether a build is ready to package for marketplace delivery. Do not mark an item complete from assumption; record the command, environment or artifact used for verification.

## Source and quality baseline
- [ ] Clean checkout uses the documented Node.js and pnpm versions.
- [ ] `pnpm install --frozen-lockfile` succeeds.
- [ ] `pnpm typecheck` succeeds.
- [ ] `pnpm lint` succeeds.
- [ ] `pnpm test` succeeds.
- [ ] `pnpm build` succeeds.
- [ ] Required CI workflow is green for the release commit.

## Infrastructure
- [ ] PostgreSQL starts from the documented Compose configuration.
- [ ] Redis starts from the documented Compose configuration.
- [ ] Database migrations apply on a clean database.
- [ ] Migration history is preserved; no deployed migration was edited.
- [ ] Production credentials are not development defaults.
- [ ] Production secrets are supplied outside source control.

## Buyer Quick Launch
- [ ] Admin can create a draft from a clean database.
- [ ] Draft can be saved and reloaded.
- [ ] All 11 Quick Launch steps can be completed.
- [ ] Feature visibility is reflected in the published snapshot.
- [ ] Terminology labels preserve stable implementation identifiers.
- [ ] Matching categories and rules are reviewed for the intended market.
- [ ] Publish creates an immutable version.
- [ ] Published configuration and history can be retrieved.

## Security and operational handoff
- [ ] No demo credentials are included as production credentials.
- [ ] Legal/support destinations are configured for the buyer's deployment.
- [ ] TLS and public hosting are configured by the deployment owner.
- [ ] Database backup/restore ownership is documented.
- [ ] Monitoring and incident ownership are assigned.

## Marketplace package
- [ ] README describes the product scope accurately.
- [ ] INSTALLATION.md is included.
- [ ] QUICK_START.md is included.
- [ ] License terms are included and reviewed.
- [ ] Changelog/release notes identify the release version.
- [ ] Package contains no local `.env` secrets, build caches or development databases.
- [ ] Buyer receives source, documentation and any required license files together.

## Final sign-off
Release commit SHA: ____________________

Clean-environment verifier: ____________________

Verification date: ____________________

Marketplace package version: ____________________
