# Identity Authentication Boundary

## Status
Phase 3 implementation boundary established before credential persistence.

## Grounding
- PRODUCT_REQUIREMENTS.md requires account registration/sign-in and secure account recovery (REQ-AUTH-001, REQ-AUTH-002).
- DECISIONS.md technology baseline requires provider-neutral, API-owned authentication and identifies email/password, verification and reset capabilities as the initial capability set.
- ARCHITECTURE.md explicitly separates authentication credentials from ordinary account data and leaves authentication provider/method implementation details unresolved.
- The existing API authentication boundary resolves a RequestPrincipal once per request through RequestAuthenticationAdapter.

## Established boundaries
1. Account is not an authentication credential container.
2. Authentication must ultimately resolve to the existing provider-neutral RequestPrincipal.
3. Credential verification, account recovery and contact verification are distinct concerns.
4. Provider-specific credential payloads and transport tokens must terminate at adapters.
5. Password hashing algorithm, session/token format, and external identity-provider protocol are not selected by this document.
6. Credential persistence must be designed explicitly before adding fields to the physical Account schema.

## Initial capability decomposition
- Registration identity: establish an identity/credential association with an account.
- Sign-in: verify an authentication method and resolve an account principal.
- Contact verification: establish the configured verification outcome without exposing raw provider evidence.
- Recovery: authorize credential replacement through a secure, independently modeled recovery flow.

## Implementation order
The next code slice must establish a provider-neutral credential persistence contract and migration plan. It must not:
- add password material to accounts;
- expose password hashes through account repositories or API projections;
- introduce JWT/session formats;
- select an external identity provider implicitly.

The persistence contract should be testable independently of HTTP transport and should identify only the minimum authoritative fields required for credential lookup, account linkage, credential material storage boundary, and lifecycle state.

## Exact next action
Inspect the logical data model and existing migration conventions, then define the smallest physical credential model that is explicitly traceable to the boundaries above before writing a migration.
