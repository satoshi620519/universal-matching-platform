# Phase 13 Admin Console Checkpoint

## Scope
Phase 13 defines the professional administration system required for normal operation without source-code changes.

Required sections:
- Dashboard
- Users
- Profiles
- Reports
- Moderation
- Matches
- Conversations metadata where legally appropriate
- Countries/regions
- Configuration
- Feature flags
- Themes
- Localization
- Analytics
- Audit logs
- System health

## Current baseline

Existing production foundations are reused rather than reimplemented:

- Moderation Console UI exists in `apps/admin/src/moderation-console.tsx`.
- Quick Launch configuration workflow exists in `apps/admin/src/main.tsx` and related workflow/API modules.
- Administrative capability and role authorization exists in `apps/api/src/administration`.
- Audit-record persistence and administrative audit correlation foundations exist.
- Configuration publication, validation, versioning, and reversion foundations exist.

## Phase 13 implementation checkpoint

The first shared Admin Console navigation model has been added:

- `apps/admin/src/admin-console-shell.ts`
- Sections currently wired at the model level: Dashboard, Moderation, Quick Launch.
- The model is intentionally data-driven so later sections can be added without duplicating navigation logic.

## Next implementation boundary

Do not invent a parallel analytics system inside the Admin Console. Phase 14 owns business analytics.

The next Phase 13 implementation should establish the Dashboard as an operational overview using already-authoritative administrative/read APIs. Before adding new API aggregation, inspect existing repositories/controllers/services for reusable read models.

The Dashboard should not expose privileged conversation content merely for convenience. Conversations are metadata-only where legally appropriate, consistent with the roadmap.

## Validation rule

Every implementation step must preserve the existing server-side authorization boundary. UI visibility is not an authorization mechanism.

CI must be run after implementation changes. Do not record a passing status without actual CI evidence.

## Continuity

This file is a lightweight Phase 13 checkpoint so work can resume without repeating discovery or reimplementing existing foundations.
