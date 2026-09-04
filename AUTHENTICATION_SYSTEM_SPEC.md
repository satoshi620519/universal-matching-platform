# Authentication and Account System Specification

## Status
Phase 6 authoritative reconciliation baseline.

## Purpose
Define the implementation contract for authentication and account security without reopening completed account deletion, verification, authorization, or provider-neutral identity boundaries.

## Capability model
Phase 6 covers:
1. Email/password registration and sign-in.
2. Secure password reset and credential replacement.
3. Contact/account verification flow integration.
4. Server-authoritative session lifecycle and device/session security.
5. Account deletion lifecycle integration.
6. Privacy controls at account boundary.
7. Optional social-login adapters without selecting a provider.

## Architectural invariants
- Account is never a credential container.
- Authentication identity, credential, verification, recovery, and session are separate lifecycles.
- Provider-specific payloads and transport tokens terminate at adapters.
- Authentication resolves a backend-authoritative principal; clients do not supply authorization claims.
- Secrets and raw credential material never enter account/profile projections or ordinary repositories.
- All destructive account operations remain subject to explicit retention and legal-hold policy.

## Minimum authoritative contracts

### Authentication identity
Provider-neutral linkage:
- accountId
- providerType
- providerSubject
- lifecycle status
- timestamps

Uniqueness: providerType + providerSubject.

### Password credential
Dedicated secure material linked to an authentication identity:
- identityId
- opaque password hash
- lifecycle status
- replacement timestamp/audit metadata

No password hash is stored on Account.

### Verification
Reuse the independent verification lifecycle. Authentication may consume an authorized outcome but must not store provider evidence on AuthenticationIdentity.

### Recovery
Recovery authorizes credential replacement through a separately modeled, single-purpose flow. Raw recovery secrets are never persisted or exposed through account APIs.

### Sessions and devices
Sessions are server-authoritative and independently revocable. Device metadata is treated as security context, not as an authorization claim. Required operations:
- create session after successful authentication;
- inspect current session context;
- revoke current session;
- revoke another authorized session;
- revoke all sessions for an account after security-sensitive credential replacement.

Session/token serialization and signing formats remain adapter concerns.

### Account deletion
Reuse the existing eligible -> pending-deletion transition. Authentication/session state must not bypass lifecycle restrictions. Hard deletion, anonymization, retention scheduling, and legal holds remain separate data-lifecycle work.

### Privacy controls
Account privacy controls expose only authorized, purpose-specific settings. They must not leak credentials, provider payloads, verification evidence, recovery secrets, or session secrets.

## Optional social login
Social login is an adapter extension point over AuthenticationIdentity. No OAuth/OIDC provider is selected by this specification.

## Implementation order
1. Inventory and reconcile existing identity persistence.
2. Define dedicated credential persistence and repository boundary.
3. Implement password verification/replacement service.
4. Add recovery lifecycle contract.
5. Add server-authoritative session lifecycle.
6. Integrate verification outcomes without evidence leakage.
7. Connect account deletion and privacy boundaries.
8. Add HTTP adapters last.

## Non-duplication rule
Existing account deletion and verification lifecycles remain authoritative. Do not create parallel account-state, verification, authorization, or safety systems.

## Exact next action
Reconcile the actual current persistence implementation for authentication identities and select the smallest missing credential/session contract before runtime coding.
