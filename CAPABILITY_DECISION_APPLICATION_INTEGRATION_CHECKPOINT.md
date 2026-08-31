# Capability Decision Application Integration Checkpoint

## Status
Domain capability decision semantics are implemented; application integration remains intentionally narrow.

## Existing application seam
The API already has:
- CapabilityAccessService for legacy verification/entitlement evaluation.
- AuthenticatedCapabilityAccessService for authenticated principal evaluation.
- VerificationCapabilityAccessService for persisted verification outcome composition.

## Integration decision
Do not replace these services wholesale yet.

The new decideCapability() domain function requires AccountState and SafetyRestriction inputs, but the existing authenticated capability flow currently resolves only the authenticated account principal and verification level.

Introducing synthetic defaults for account state or safety restriction would create false authority.

## Exact next action
Ground authoritative application sources for AccountState and SafetyRestriction, then add a narrow adapter that constructs CapabilityDecisionContext from those sources. Until then, keep the new domain evaluator independently validated.
