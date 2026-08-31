# Registration transport semantics

## Email/provider subject normalization

The initial email-password registration flow treats providerSubject as an
already-normalized provider identifier. HTTP exposure must not silently invent
a normalization policy (for example provider-specific dot removal).

Before public transport is added, the application boundary must explicitly
choose and test:

- Unicode normalization;
- whitespace handling;
- case handling;
- maximum length;
- provider identity uniqueness representation.

## Duplicate identity

The database uniqueness constraint on provider type + provider subject is the
authoritative concurrency-safe guard. A preflight lookup alone is insufficient.

Public responses must not expose unnecessary account-existence information.
The exact duplicate response policy remains a transport decision.

## Password policy

Hashing is not password policy. Public registration requires an explicit
minimum policy and validation boundary before invoking PasswordHasher.

## Abuse prevention

REQ-SAFE-006 requires abuse prevention and rate limiting. Registration must be
rate-limited at a transport/edge boundary before public exposure.

## Consequence

PasswordRegistrationService remains application-internal until these four
transport contracts are implemented and tested.
