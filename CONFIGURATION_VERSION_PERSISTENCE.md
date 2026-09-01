# Configuration version persistence

Configuration persistence is append-oriented and versioned.

## Version lifecycle

A version belongs to one allowed configuration scope and is `draft`, `published`, or `superseded`. Draft versions are editable working state and are never runtime inputs. Published versions are immutable runtime candidates, with at most one current published version per scope. Superseded versions remain historical for audit and later explicit reversion.

## Typed values

Values are not stored as an untyped JSON blob. Each row declares a primitive type and exactly one corresponding typed column is populated.

Runtime precedence is deliberately not encoded in SQL. Persistence supplies published values; `resolveConfigurationValue()` remains the centralized precedence authority.

Draft editing, publication transitions, audit integration and rollback/reversion remain subsequent slices.
