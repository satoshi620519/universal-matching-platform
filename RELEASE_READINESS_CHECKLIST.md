# Release Readiness Checklist

## Product package integrity
- [ ] Clean checkout from the release commit
- [ ] No .env files, credentials, tokens, or private keys
- [ ] No local databases, logs, or temporary artifacts
- [ ] Dependency lockfile included
- [ ] License approved for commercial distribution
- [ ] Third-party attribution reviewed

## Reproducibility
- [ ] Follow INSTALLATION.md from a clean environment
- [ ] Follow QUICK_START.md without undocumented steps
- [ ] Run migrations successfully
- [ ] Start API, Web, and Admin successfully
- [ ] Run required CI gates successfully

## Buyer experience
- [ ] Quick Launch can save a draft
- [ ] Reviewed configuration can publish
- [ ] Published configuration/history is visible
- [ ] Documentation links resolve
- [ ] Troubleshooting covers common setup failures

## Marketplace package
- [ ] Accurate listing copy
- [ ] Feature list
- [ ] System requirements
- [ ] Support scope
- [ ] External-cost disclosure
- [ ] Buyer FAQ
- [ ] Verified screenshots
- [ ] Actual demo instructions or no-demo disclosure
- [ ] Marketplace-specific metadata

## Release decision
Do not mark the product marketplace-ready until every applicable item above has evidence.
