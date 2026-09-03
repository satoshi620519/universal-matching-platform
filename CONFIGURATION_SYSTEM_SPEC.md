# Configuration System Specification

## Purpose
Define the supported configuration boundaries for Universal Matching Platform before expanding implementation. The system must let a non-expert buyer launch safely while preserving explicit extension points for developers.

## Configuration levels

### Level 1 — Quick Launch
Safe, purchaser-facing changes without protected-core code edits:
- application name and branding
- theme colors and typography tokens
- imagery and terminology
- enabled countries and supported languages
- regions/localities where configured
- matching categories
- profile questions and onboarding fields
- feature visibility
- matching rule presets
- legal and support links

Quick Launch configuration is versioned. A buyer edits a draft, validates it, publishes an immutable snapshot, and can inspect publication history.

### Level 2 — Advanced Customization
Developer-oriented extension points:
- custom profile field types
- custom matching algorithms/scoring adapters
- category-specific policy modules
- provider adapters
- plugins/extensions
- custom UI components
- API integrations and webhooks

Advanced Customization may extend the core but must not bypass server-side authorization, privacy boundaries, auditability, or safety policy enforcement.

## Ownership boundaries
- Client configuration improves presentation and buyer workflow only.
- Backend validation is authoritative.
- Protected capability, payment, verification and moderation decisions remain server-side.
- Published configuration is immutable; replacement creates a newer version.
- Deployment-specific secrets are never stored in purchaser configuration.

## Configuration domains
1. Branding and theme
2. Geography and localization
3. Categories and terminology
4. Profile schema and onboarding
5. Feature flags and visibility
6. Matching presets and policy references
7. Legal/support links
8. Notification presentation preferences

## Extension contract
Every future configuration domain must define:
- schema and validation
- default value
- purchaser Quick Launch visibility
- advanced customization extension point
- publication/version behavior
- migration compatibility
- authorization requirements

## Non-goals
Quick Launch must not expose arbitrary database access, secrets, authorization rules, payment authority, identity-verification decisions, or moderation enforcement internals.

## Completion criteria for the next configuration expansion
- Specification approved and recorded
- Domain boundaries mapped to implementation packages
- Existing Quick Launch aggregate reused rather than duplicated
- At least one new configuration domain implemented end-to-end
- Draft/publish/version semantics preserved
- CI green
