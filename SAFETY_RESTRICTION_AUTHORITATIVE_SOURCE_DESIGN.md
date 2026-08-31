# Safety Restriction Authoritative Source Design Checkpoint

## Evidence
- PRODUCT_REQUIREMENTS.md requires feature restriction, communication restriction, temporary suspension and scope/duration/effective-time metadata (REQ-MOD-017 through REQ-MOD-022).
- Safety restrictions must propagate consistently across protected capabilities (REQ-MOD-019, REQ-SAFE-008).
- The domain already defines SafetyRestriction and blocksCapability().
- The current Prisma schema has no authoritative persisted safety restriction or enforcement action model.

## Decision
Do not default SafetyRestriction to 'none' inside authorization code.

Do not add a generic policy engine.

The next concrete slice should introduce an authoritative, append-friendly enforcement restriction record with:
- stable identifier
- subject account
- restriction type
- capability scope
- effective time
- optional expiry
- reason category
- active/revoked lifecycle metadata

The record should be evaluated into the existing SafetyRestriction domain primitive before CapabilityDecision construction.

## Exact next action
Define the smallest domain model and persistence boundary for active safety enforcement restrictions, with focused lifecycle tests before integrating it into authenticated capability decisions.
