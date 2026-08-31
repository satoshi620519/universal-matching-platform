# Email/password authentication implementation boundary

## Status

Milestone 1 continuation checkpoint.

## Grounding

- REQ-AUTH-001 requires account registration and sign-in.
- REQ-AUTH-002 requires secure account recovery.
- DECISIONS.md selects an API-owned, provider-neutral authentication architecture with email/password, verification and reset as the initial capability set.
- AuthenticationIdentity already provides provider-neutral account linkage but intentionally stores no credential secret.
- RequestAuthenticationAdapter remains the transport boundary and currently has only an anonymous implementation.

## Smallest safe next slice

The next implementation slice should introduce a dedicated password credential boundary linked to AuthenticationIdentity, not Account.

Before credential code is written, the physical contract must define:

1. identity linkage and uniqueness;
2. opaque password-hash storage boundary;
3. credential lifecycle/disable semantics;
4. replacement semantics needed by recovery;
5. repository operations that never return raw credential material to account/profile projections.

## Explicitly blocked from this slice

Do not introduce:

- password hashes on Account;
- JWT format or signing policy;
- session persistence;
- refresh tokens;
- password-reset token format;
- email delivery provider;
- external OAuth/OIDC protocol;
- client-supplied verification/authorization claims.

Those are independent boundaries.

## Continuation

First implement the additive credential persistence model and repository contract. Sign-in transport can follow only after an authentication result can be established without leaking credential material.
