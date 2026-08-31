# Authentication Credential Persistence Plan

## Status
Pre-migration design checkpoint for the M1 identity slice.

## Evidence
DATA_MODEL_DRAFT.md defines AuthenticationIdentity as the account-to-authentication boundary, with:
- Account 1 → N AuthenticationIdentity;
- provider-neutral identity references;
- lifecycle state;
- credentials and provider secrets outside ordinary profile/account records.

ARCHITECTURE.md requires authentication credentials to remain outside ordinary account data and provider-specific payloads to terminate at adapters.

## Minimum physical model

### authentication_identities
Authoritative ownership boundary between an account and a provider-neutral authentication identity.

Minimum fields:
- id: stable opaque primary identifier.
- account_id: required foreign key to accounts.
- provider_type: stable provider/method discriminator.
- provider_subject: provider-neutral subject reference.
- status: lifecycle state.
- created_at.
- updated_at.

Candidate uniqueness:
- UNIQUE(provider_type, provider_subject)

Required lookup support:
- account_id for resolving an account's identities.
- unique provider identity lookup for sign-in adapter resolution.

## Explicit exclusions
This migration must not add:
- password hashes to accounts;
- refresh/access tokens;
- JWT/session state;
- provider payload blobs;
- verification evidence;
- recovery secrets.

A password credential implementation, if selected later, should be a dedicated secure credential mechanism linked to authentication_identity rather than an Account field.

## Migration compatibility
- Additive migration only.
- Existing accounts remain valid without identities.
- No destructive changes or backfill are implied.
- Prisma model must map exactly to the physical migration.
- Migration versioning follows packages/database/migrations/README.md and applied artifacts remain immutable.

## Exact next action
Implement the additive authentication_identities schema migration and matching Prisma model, then add focused migration and model-boundary tests.
