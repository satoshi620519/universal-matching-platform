# Password registration use-case boundary

## Smallest safe workflow

1. Create a pending account.
2. Create an active email/password AuthenticationIdentity for that account.
3. Hash the plaintext password through PasswordHasher.
4. Persist only the resulting opaque hash as PasswordCredential.

## Consistency boundary

The three persistence writes require a transaction boundary before production
registration is exposed. The existing repositories are independently scoped and
do not yet expose a shared unit-of-work abstraction.

Therefore this checkpoint intentionally does not add a partially atomic
registration service that could leave orphan accounts or identities after a
later write fails.

## Next implementation prerequisite

Introduce an application-level registration persistence boundary capable of
performing Account, AuthenticationIdentity and PasswordCredential creation in
one database transaction. The boundary must receive only the password hash,
never plaintext.

## Explicitly deferred

- HTTP registration endpoint
- email normalization policy
- password strength policy
- duplicate-account response policy
- session/JWT issuance
- email verification delivery

