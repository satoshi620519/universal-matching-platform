# Configuration publication transaction

Publication is an application-level lifecycle transition, not a repository side
effect and not a runtime resolution concern.

The selected version is loaded as a draft first. One database transaction then:

1. supersedes the current published version for the same scope, if one exists;
2. transitions the selected draft to published;
3. fails the transaction if the selected row is no longer a draft.

The transaction boundary prevents partial publication state from being reported as
success. Historical superseded versions remain intact.

Runtime scope precedence is still owned exclusively by the domain configuration
resolver. Rollback/reversion and publication audit records remain later slices.
