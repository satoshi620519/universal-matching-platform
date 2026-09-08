# Customization Guide

## Choose the correct customization level

### Quick Launch — no protected-core code edits

Use Admin Quick Launch for:

- application name and branding
- colors and typography
- countries, locales, and timezone defaults
- categories
- profile schema and onboarding
- feature visibility
- terminology
- matching rule presets
- legal and support destinations

Publish a reviewed draft to create an immutable configuration version.

### Advanced customization — developer work

Use supported extension contracts for:

- provider adapters
- domain strategies
- custom profile field types
- matching/scoring extensions
- category-specific policy modules
- custom UI
- integrations and outbound events

See DEVELOPER_EXTENSIBILITY.md and API_AND_DEVELOPER_EXTENSIBILITY_SPEC.md.

## Protected boundaries

Do not use customization to bypass:

- authorization
- privacy controls
- moderation enforcement
- verification decisions
- payment authority
- secret management

Deployment secrets belong in environment/infrastructure configuration, not Quick Launch settings.

## Safe workflow

1. Prefer Quick Launch when the desired change is supported.
2. Identify an existing extension contract before editing core code.
3. Make additive changes where possible.
4. Add focused tests.
5. Run typecheck, lint, test, and build before distribution.
