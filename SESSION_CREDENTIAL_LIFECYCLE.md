# Session credential lifecycle decisions

## Current credential

A successful password sign-in creates a new independent opaque session
credential. The raw value is returned once; only its SHA-256 hash is stored.

## Revocation

Sign-out is idempotent at the persistence boundary: only an unrevoked session is
updated. Repeating revocation does not overwrite the original revokedAt value
and does not require exposing whether the session was already revoked.

## Rotation

Credential rotation is deliberately deferred. The current model supports
multiple concurrent sessions per account, so replacing a credential implicitly
would require a clear product policy about whether other devices are revoked.

Before implementing rotation, define one of:

- per-session rotation with replacement and immediate predecessor revocation;
- account-wide credential invalidation;
- device/session family tracking.

No rotation mechanism is added until that policy exists.
