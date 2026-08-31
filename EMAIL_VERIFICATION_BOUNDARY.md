# Email verification boundary

Email verification uses a separate opaque one-time credential from authentication
sessions.

Lifecycle:

1. registration creates a pending account;
2. a verification issuer may request a 32-byte opaque token for that account;
3. only the SHA-256 token hash is persisted;
4. the token expires after 30 minutes;
5. verification atomically consumes an unconsumed, unexpired token;
6. a pending account is transitioned to active.

The verification endpoint returns only `verified: true|false` and does not
expose whether a token was missing, expired, already consumed, or associated
with an account in an unexpected state.

## Deliberately deferred integration

This repository does not yet contain an outbound email delivery adapter or a
trusted verification-link construction policy. Therefore registration does not
return a raw verification token to clients and does not pretend to have sent an
email. The issuance primitive is available for a future delivery workflow.

Schema changes also require a generated and applied Prisma migration before
deployment.
