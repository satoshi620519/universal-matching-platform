# Configuration resolution baseline

This slice establishes the first pure domain primitive for controlled runtime
configuration resolution.

It intentionally covers only typed setting definitions, allowed scopes and
deterministic precedence:

platform → deployment → region/category → category+region

More specific values win only when the setting definition explicitly permits
that scope. If no applicable value exists, the typed default is returned.

This is not yet configuration persistence or publication. Draft validation,
immutable published versions, rollback, auditing and safe client projections
remain separate Milestone 2 boundaries. Keeping the first slice pure prevents
transport or database details from silently defining product policy precedence.
