# Configuration Architecture

## Status
Phase 2 architecture artifact — configurable product baseline.

## Purpose
Define how a purchaser/operator can safely adapt one product to different matching categories, regions and brands without forking core business logic unnecessarily.

## Core principle
Configuration is a first-class product capability. Runtime configuration is controlled, typed, versioned and auditable; it is not an unrestricted key-value backdoor.

# 1. Configuration layers

Resolution may consider these layers:

1. Platform defaults
2. Deployment/tenant configuration
3. Region configuration
4. Matching category configuration
5. Feature configuration
6. Experiment/temporary rollout configuration where explicitly approved
7. Subject-specific preferences

Not every setting is valid at every layer.

# 2. Resolution precedence

More specific configuration may override less specific configuration only when the setting explicitly supports that scope.

Illustrative precedence:

subject preference
→ approved experiment
→ category + region override
→ category override
→ region override
→ deployment configuration
→ platform default

Safety invariants and hard platform restrictions are not ordinary overridable configuration.

# 3. Configuration domains

Initial domains include:

## Branding
- name
- logo references
- color/theme tokens
- imagery references

## Localization
- supported locales
- default locale
- translation configuration

## Geography
- enabled countries/regions
- geographic matching boundaries
- region-specific availability

## Category
- enabled matching categories
- profile schema selection
- discovery criteria
- category terminology

## Feature availability
- enabled modules
- staged rollout
- entitlement gates

## Matching policy
- configurable inputs and weights where safe
- hard safety restrictions remain outside purchaser override

## Onboarding
- required profile fields
- consent steps
- verification requirements

## Operational policy
- rate/usage policy parameters within approved bounds
- retention configuration where legally/technically supported

# 4. Typed schemas

Every configuration domain has:
- schema;
- validation rules;
- default;
- allowed scope;
- sensitivity classification;
- publication requirements.

Example conceptual setting:

matching.discovery.max_distance

Type: integer
Unit: distance
Allowed range: bounded
Scope: deployment/region/category
Default: defined
Validation: required
Audit: publication tracked

Do not use untyped string blobs as the primary long-term configuration model.

# 5. Static vs dynamic configuration

## Static/deployment configuration
Requires infrastructure deployment or restart.

Examples:
- database connection;
- provider credentials;
- encryption material.

Never expose through ordinary purchaser administration.

## Dynamic product configuration
Can change through controlled publication.

Examples:
- branding;
- enabled countries;
- category availability;
- onboarding rules.

## User preferences
Owned by an individual account and constrained by product policy.

# 6. Draft and published versions

Configuration changes follow:

Draft
 ↓ validate
Preview/impact review where required
 ↓ publish
Immutable published version
 ↓ runtime resolution

Do not silently mutate an already published configuration version.

Published configuration records include:
- version identifier;
- scope;
- author/actor;
- creation/publish timestamps;
- change summary;
- schema version.

# 7. Rollback

Rollback means publishing a known-good prior configuration version or a derived new version, rather than editing history.

Requirements:
- explicit actor;
- audit record;
- validation against current schema/runtime;
- propagation status.

# 8. Change impact classification

Configuration changes are classified:

Low impact:
- copy/theme adjustments.

Moderate:
- feature visibility;
- onboarding field changes.

High impact:
- verification requirements;
- geography availability;
- matching policy parameters;
- privacy-sensitive defaults.

High-impact changes may require:
- stronger administrative capability;
- preview;
- confirmation;
- scheduled activation;
- audit review.

# 9. Runtime resolution

Applications do not independently invent configuration precedence.

A centralized configuration resolution service/module determines effective configuration for a context such as:

deployment
+ region
+ category
+ authenticated subject
+ client capability

Clients may receive a safe, minimized configuration projection.

Secrets and internal operational settings are never delivered to clients.

# 10. Caching

Effective configuration may be cached with explicit invalidation/version identity.

Rules:
- cache keys include relevant scope/version;
- high-impact revocations propagate promptly;
- stale configuration must have bounded lifetime;
- clients can identify configuration version where debugging/reconciliation requires it.

# 11. Feature flags

Feature flags are a specialized configuration mechanism, not a replacement for authorization.

A feature may be:
- disabled globally;
- enabled for deployment/region/category;
- rolled out to an approved cohort.

Feature visibility does not grant permission. Authorization still evaluates capabilities independently.

Flags have:
- owner;
- purpose;
- expiration/review date;
- default state.

Temporary flags must not become permanent undocumented architecture.

# 12. Purchaser customization model

Two supported experiences remain:

## Quick Launch
Safe administrative configuration for:
- brand;
- theme;
- content;
- geography;
- enabled categories;
- approved profile/onboarding options.

## Advanced Customization
Source-level extension points for:
- new category modules;
- custom matching logic;
- integrations;
- bespoke UX.

Configuration should cover common variation; source forks should not be required for ordinary launch customization.

# 13. Configuration and domain boundaries

Configuration can select policy parameters but should not directly bypass domain invariants.

Example:
A configuration may set an allowed discovery radius range.
It cannot configure away mandatory authorization or an active safety suspension.

Domain services receive validated effective policy, not arbitrary client-provided settings.

# 14. Administration API

Configuration administration is separate from ordinary consumer APIs.

Minimum operations:
- read effective configuration;
- create/edit draft;
- validate;
- preview where supported;
- publish;
- list versions;
- rollback.

All high-impact publication actions are audited.

# 15. Migration

Configuration schemas evolve independently.

When schema changes:
- old versions remain interpretable or are migrated explicitly;
- migration is tested;
- removed settings have documented replacement/default behavior.

Never make a runtime deployment depend on an unannounced destructive configuration schema change.

# 16. Observability

Track:
- active configuration versions;
- publication success/failure;
- validation failures;
- rollback events;
- stale cache indicators;
- feature flag age.

Do not log sensitive configuration values.

# Security invariants

1. Configuration cannot override hard safety invariants.
2. Secrets are not product configuration.
3. Published versions are immutable.
4. Changes are validated before activation.
5. High-impact changes are auditable.
6. Feature flags do not replace authorization.
7. Clients receive only safe effective projections.

# Exact next step
Create ARCHITECTURE.md as the Phase 2 integration document linking completed domain, data, authorization, API, async, realtime and configuration architecture into one coherent implementation blueprint, then update DEVELOPMENT_STATUS.md to close the Phase 2 architecture milestone.
