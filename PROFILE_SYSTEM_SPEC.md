# PROFILE SYSTEM SPECIFICATION — Phase 7

## Purpose
Phase 7 turns the existing core Profile aggregate into a commercially configurable profile system without duplicating ownership already established in the repository.

The platform must support:
- avatar
- gallery
- biography
- structured fields
- purchaser-configured custom fields
- privacy visibility
- verification status
- completion progress

## Existing ownership that must be preserved
- `Profile.fields` remains the sole owner of submitted structured/custom field values.
- `ProfileSchemaConfiguration` defines allowed field metadata only.
- `ProfileProjectionPolicy` remains the runtime authority for field visibility projection.
- Quick Launch stores versioned field definitions/options, not user profile values.
- Geographic scope remains owned by `Profile.geographicScope`.
- Authentication and verification providers remain independent of profile presentation.

## Aggregate model
Phase 7 extends the profile model with first-class profile metadata while keeping structured/custom values in `fields`.

Required conceptual metadata:
- avatar reference: optional single media reference
- gallery references: ordered collection with a bounded maximum
- biography: optional long-form text with explicit length limit
- verification status: provider-neutral state, never a provider payload
- completion: derived at runtime from configured required fields and required core metadata

## Media boundaries
Profile media stores opaque storage references and metadata needed for safe ordering/projection. It does not own object-storage implementation.

No raw binary data, provider-specific URLs, or image moderation decisions belong in the Profile domain model.

Suggested lifecycle states:
- pending
- active
- removed

Only active media is exposed in public projections.

## Biography
Biography is a first-class convenience field for consistent UX, but it must not create a second arbitrary custom-field store.

Rules:
- optional
- trimmed
- maximum length defined centrally
- visibility follows explicit profile projection rules

## Structured and custom fields
Structured/custom fields continue to use `Profile.fields`.

Phase 7 runtime validation must consume a deployment's configured profile schema rather than hard-coded category schemas.

The existing category defaults may remain as compatibility defaults, but purchaser-published Profile Schema configuration is the future deployment-level source for allowed metadata.

## Visibility
Visibility is declarative and projection-based.

Supported baseline semantics:
- public
- owner
- privileged

Future visibility expansion must remain backward compatible and must not grant authorization.

## Verification status
Profile verification is a projection of an authoritative verification outcome into a provider-neutral profile state.

Baseline states:
- unverified
- pending
- verified
- rejected

Profile verification status is informational/presentation state. Protected capabilities must continue to consult authoritative verification policy rather than trusting profile presentation alone.

## Completion progress
Completion is derived, never independently persisted as mutable truth.

The calculation must be deterministic from:
- required configured fields
- required core metadata selected by deployment policy
- actual profile values/media availability

Output should expose:
- completedRequiredCount
- totalRequiredCount
- percentage
- missing requirement keys

This avoids stale counters and gives purchasers/UI a useful onboarding signal.

## API/service boundaries
Phase 7 should be implemented in this order:
1. Define domain contracts and invariants.
2. Add deterministic projection/completion calculation.
3. Add repository persistence contracts and Prisma mapping/migration.
4. Reconcile ProfileService with configured schema validation.
5. Add focused service tests.
6. Add HTTP transport only after core behavior is validated.
7. Integrate Quick Launch profile schema only through the existing immutable publication lifecycle.

## Commercial customization requirement
Quick Launch purchasers can configure field definitions and supported profile requirements without editing protected core code.

Advanced customization can add field types and presentation extensions through explicit contracts.

No purchaser configuration may:
- store user profile values inside configuration snapshots
- bypass profile visibility projection
- grant verification privileges
- bypass authorization
- create a parallel profile aggregate

## Acceptance criteria
Phase 7 is not complete until:
- avatar contract and validation exist
- ordered gallery contract and bounds exist
- biography validation exists
- structured/custom fields validate against schema
- visibility projection covers new core metadata
- verification status is provider-neutral
- completion is deterministic and tested
- Prisma persistence/migration is validated
- Quick Launch ownership remains schema-only
- CI passes for all changed behavior
