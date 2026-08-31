# Account deletion lifecycle transition — IMPLEMENTED

## Scope

This checkpoint completes the smallest safe production behavior identified by
`ACCOUNT_DELETION_LIFECYCLE_BOUNDARY.md`:

`eligible account state → pending-deletion`

The transition is intentionally separate from destructive erasure.

## Implemented path

1. HTTP request requires an authenticated principal.
2. The account target is resolved exclusively from that principal.
3. Existing domain transition rules decide whether the current state may enter
   `pending-deletion`.
4. The new state is persisted through `AccountRepository`.
5. Missing accounts during the persistence boundary are rejected explicitly.

## Explicitly not implemented

- hard deletion
- automatic anonymization
- retention scheduling
- legal holds
- external identity-provider cleanup
- destructive cascades

Those operations remain blocked on explicit data-lifecycle policy.

## Regression coverage

Service coverage verifies authenticated-target derivation and persistence-race
handling. Controller coverage verifies authenticated identity derivation and
rejection of unauthenticated requests.

## Continuation boundary

Do not expand deletion into destructive privacy operations without first defining
retention, anonymization, legal-hold and audit policy. Resume Milestone 1 work
from the next independently incomplete requirement rather than adding duplicate
tests to this transition.
