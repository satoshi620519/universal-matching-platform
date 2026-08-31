# Password hashing boundary

## Contract

Password callers depend on PasswordHasher only:

- hash(plaintext) → opaque encoded hash
- verify(plaintext, opaque hash) → boolean

Plaintext passwords must not cross into repositories or account/profile projections.

## Initial implementation

NodeScryptPasswordHasher is the initial runtime adapter.

Its encoded output is versioned with the scrypt-v1 prefix and contains the data
required for verification. The format is an implementation detail of the hasher
boundary, not a general authentication token.

## Rotation

A future hasher can recognize older formats and rehash after successful
verification. Callers must not parse hashes to make authorization decisions.

## Explicitly outside this slice

- registration transport
- sign-in transport
- session/JWT issuance
- password reset delivery
- credential policy/rate limiting
- hash parameter migration policy

Those remain separate implementation boundaries.
