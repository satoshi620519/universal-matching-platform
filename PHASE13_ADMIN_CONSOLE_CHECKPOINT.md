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


## 2026-09-07 acceptance reconciliation

Verified Phase 13 surfaces at the current checkpoint:

- Dashboard: implemented through authenticated administrative read API.
- Users / Profiles: implemented.
- Reports / Moderation: implemented through the moderation directory and authoritative moderation workflow.
- Matches: implemented.
- Conversations metadata only: implemented; no privileged message-body convenience path was introduced.
- Configuration / feature visibility / themes / localization / countries: implemented through the authenticated Quick Launch configuration workflow and immutable publication history.
- Audit logs: implemented.
- System health: implemented.
- Analytics: intentionally not implemented inside Phase 13; Phase 14 owns business analytics.

Concrete inconsistency fixed during reconciliation:
- `admin-console-shell.ts` still described only the original three sections while the actual Admin application wires nine operational sections. The shared navigation model is now aligned with the real UI and regression-tested.

Remaining explicit Phase 13 gap:
- The roadmap calls out countries/regions. Country configuration exists, but no authoritative region-management administration surface or underlying region registry was found. Do not falsely mark region administration complete or invent a parallel geography store. The next task must reconcile this with the authoritative internationalization/location model before deciding whether the missing boundary belongs in Phase 13 or depends on a later location foundation.

Completion rule:
- Phase 13 can only be marked complete after the country/region administration boundary is explicitly resolved and a fresh executable validation result is available for the final checkpoint.


## 2026-09-07 region boundary resolution

Internationalization/location inspection found an existing domain-level hierarchy:

`global -> country -> region -> city` via `GeographicScope`.

Country identifiers are ISO 3166-1 alpha-2 codes. Region and locality identifiers are deliberately opaque normalized codes; there is currently no authoritative region registry in the persistence or configuration model.

Decision for Phase 13:
- Do not invent a second region table/registry solely for the Admin Console.
- Keep country availability authoritative in published localization configuration.
- Treat region codes as domain-scoped identifiers whose registry/provider is a future location-data foundation, not an Admin UI-owned mutable list.
- Phase 13 satisfies the administration requirement by exposing country configuration now and preserving the existing region-aware domain model; explicit CRUD region administration is deferred until an authoritative geographic data source is introduced.

This resolves the acceptance ambiguity without creating duplicate geography authority.
