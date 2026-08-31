# Verification Persistence Plan

## Status
Pre-migration design checkpoint derived from the existing VerificationRecord domain and DATA_MODEL_DRAFT.md.

## Authoritative boundaries
Verification persistence is independent from AuthenticationIdentity. Raw provider evidence remains outside ordinary application tables.

## Minimum model

### verification_requests
Owns a provider-neutral verification workflow request.

Fields:
- id: stable opaque identifier.
- account_id: required account owner.
- requested_level: integer 0..3 represented by application validation.
- workflow_reference: opaque provider-neutral workflow reference.
- status: lifecycle state.
- created_at.
- completed_at nullable.
- expires_at nullable.

Indexes:
- account_id + status for current verification evaluation.

### verification_outcomes
Owns the authoritative decision produced for a request.

Fields:
- id: stable opaque identifier.
- verification_request_id: required foreign key.
- level: authoritative verified level.
- status: outcome status.
- decided_at nullable.
- reason_category nullable.
- expires_at nullable.
- created_at.
- updated_at.

Indexes:
- verification_request_id.
- status + expires_at only when evaluation patterns require it.

## Mapping to VerificationRecord
VerificationRecord is reconstructed from authoritative outcome fields:
- level ← verification_outcomes.level
- status ← verification_outcomes.status
- verifiedAt ← decided_at when status is verified
- expiresAt ← expires_at

No raw provider response, document, biometric artifact or secret is stored in either table.

## Migration order
1. Add verification_requests.
2. Add verification_outcomes with FK ownership.
3. Do not link AuthenticationIdentity yet.
4. Do not introduce provider SDK or transport semantics.
5. Add focused migration integration coverage.

## Exact next action
Implement additive migration 0003 and exact Prisma mappings, then validate with the PostgreSQL migration integration gate.
