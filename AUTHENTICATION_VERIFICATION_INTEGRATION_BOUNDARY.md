# Authentication and Verification Integration Boundary

## Status
Design checkpoint after validated AuthenticationIdentity and Verification lifecycles.

## Grounding
- REQ-AUTH-003 requires configurable verification levels.
- REQ-ONBOARD-008 separates account creation from activation of restricted capabilities.
- REQ-IDV-005 and REQ-IDV-015 require verification outcomes to be reusable by protected capabilities.
- REQ-ACCESS-001 requires authoritative backend capability decisions.

## Integration decision
Authentication establishes the account principal. Verification does not alter authentication identity lookup.

The next integration seam is therefore:

Authentication success
  -> authenticated account principal
  -> protected capability check
  -> policy-required verification level
  -> VerificationService usable outcome evaluation

No verification status is embedded into:
- AuthenticationIdentity
- authentication provider lookup
- password/token/session credentials

## Explicitly deferred
- JWT/session transport
- password credential implementation
- provider protocol callbacks
- global capability policy engine
- verification requirement configuration persistence

These require separate grounded decisions.

## Exact next action
Define the smallest reusable verification-level access evaluator that compares a required level with an already usable VerificationRecord, without coupling it to authentication transport.
