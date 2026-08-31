# Password sign-in and sign-out contract

## POST /auth/sign-in

Request:

```json
{ "email": "user@example.test", "password": "..." }
```

The endpoint rate limits before credential verification.

Both invalid credentials and unknown identities return HTTP 200 with an empty
object. A successful sign-in returns HTTP 200:

```json
{ "credential": "opaque-session-credential" }
```

The credential is returned only by issuance and must be presented as:

```
Authorization: Bearer <credential>
```

## POST /auth/sign-out

Requires a currently authenticated opaque session credential.

The endpoint revokes the current session and returns HTTP 204. A revoked
credential cannot resolve to a RequestPrincipal on subsequent requests.

## Deployment prerequisite

AuthenticationSession schema changes require a generated and applied Prisma
migration before this contract can be deployed against an existing database.
