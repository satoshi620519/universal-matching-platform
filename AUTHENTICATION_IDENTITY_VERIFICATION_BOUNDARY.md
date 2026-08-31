# Authentication Identity and Verification Boundary

## Grounding
- REQ-AUTH-003 requires configurable verification levels.
- REQ-IDV-001 through REQ-IDV-020 define provider-replaceable verification outcomes and capability linkage.
- The domain VerificationRecord is outcome-only: level, status, verifiedAt and optional expiresAt.
- AuthenticationIdentity is an authentication linkage record and intentionally contains no verification evidence.

## Boundary decision
Authentication identity lifecycle and verification lifecycle remain separate.

An AuthenticationIdentity:
- links an account to a provider-neutral authentication subject;
- may be active or inactive;
- is eligible for authentication lookup only while active.

A VerificationRecord:
- represents a verification outcome at an abstract platform level;
- is evaluated independently for usability and expiry;
- must not expose provider evidence to ordinary application components.

Therefore no verification columns are added to authentication_identities in the current slice.

## Future integration seam
A future verification association must be explicit and support:
- outcome lookup by an authorized subject;
- configurable required level;
- expiry/revocation reevaluation;
- provider replacement without changing AuthenticationIdentity.

The association key is intentionally unresolved until verification persistence ownership is implemented.

## Exact next action
Implement verification persistence as its own provider-neutral lifecycle before linking it to authentication identities or authentication flows.
