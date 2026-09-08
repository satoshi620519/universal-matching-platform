# Developer Guide

## Purpose

This guide is for source-product buyers who need to extend the Universal Matching Platform without rewriting protected platform boundaries.

## Local development

Follow INSTALLATION.md for prerequisites, infrastructure, environment configuration, migrations, and application startup.

Before submitting a release or customization:

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Architecture and extension points

Prefer supported contracts over direct persistence edits:

- provider adapters for infrastructure integrations
- domain strategies for matching and policy behavior
- outbound extension events for external consumers
- configuration boundaries for deployment-specific behavior

See DEVELOPER_EXTENSIBILITY.md and API_AND_DEVELOPER_EXTENSIBILITY_SPEC.md for compatibility rules.

## Change rules

- prefer additive changes
- preserve server-side authorization and safety enforcement
- do not expose secrets or ORM entities through extension payloads
- add focused tests for replacement contracts
- create new immutable database migrations rather than editing deployed migrations

## API compatibility

New stable public APIs use `/api/v1`. Avoid breaking existing contracts; breaking public changes require a new major API version and migration guidance.
