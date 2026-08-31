# Account deletion lifecycle boundary

## Purpose

REQ-AUTH-005 requires account deletion and privacy lifecycle controls. The existing AccountState domain already defines the lifecycle transitions:

- active/restricted/suspended/pending-onboarding → pending-deletion where allowed
- pending-deletion → deleted-anonymized
- deleted-anonymized is terminal

This slice records the implementation boundary before destructive persistence behavior is introduced.

## Authoritative boundary

Account lifecycle state is authoritative for deletion progression. A request to delete an account must first transition the account to pending-deletion. Final anonymization must be an explicit, auditable lifecycle operation.

The existing account record is not sufficient by itself to define retention schedules, legal holds, erasure scope, or anonymization mappings.

## Explicitly deferred

This boundary does not introduce:

- immediate hard deletion
- automatic erasure timers
- destructive cascading deletes
- retention periods
- legal-hold behavior
- anonymization field mappings
- external identity/provider cleanup

Those require a data-lifecycle and audit policy before implementation.

## Next implementation seam

The smallest safe production slice is an authenticated request that transitions an eligible account to pending-deletion through the existing AccountRepository boundary. Final deleted-anonymized behavior remains blocked on explicit privacy lifecycle policy.
