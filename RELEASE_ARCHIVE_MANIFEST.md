# Release Archive Manifest

The final distributable archive should be assembled from a clean release commit.

## Include
- application source
- package manifests and lockfile
- database schema and migrations
- configuration examples without secrets
- installation and Quick Start documentation
- administrator, user, customization, and developer guides
- deployment and troubleshooting guides
- FAQ and changelog
- approved commercial license
- required third-party notices

## Exclude
- .env and production credentials
- API keys and tokens
- private certificates and keys
- local database dumps containing real data
- build caches
- node_modules
- logs
- editor or OS temporary files
- unverified marketing screenshots

## Evidence
Record the release commit SHA, archive checksum, archive creation date, and verification result with the final release.
