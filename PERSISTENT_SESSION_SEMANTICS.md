# Persistent session and revocation semantics

AuthenticationSession is persisted with:

- accountId;
- authenticationMethod;
- expiresAt;
- revokedAt;
- createdAt.

A session is considered usable only when:

1. revokedAt is null; and
2. expiresAt is later than the evaluation time.

Revocation records a timestamp rather than deleting the row, preserving a stable
audit boundary and allowing request authentication to reject revoked sessions.

The current schema intentionally stores no bearer secret. A future credential
presentation layer must use an opaque secret that can be resolved to a session
without storing that raw secret, or another representation with equivalent
revocation properties.

Sign-in HTTP remains deferred until issuance output and request presentation are
defined together.
