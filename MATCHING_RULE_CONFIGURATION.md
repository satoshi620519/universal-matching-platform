# Matching Rules Configuration

Matching rules define configurable eligibility or scoring inputs without embedding product-specific logic in source code.

## Supported operators
- equals
- notEquals
- contains
- withinDistance
- minimumScore

Each rule has a stable deployment key, target field, operator, typed value, enabled state, and optional non-negative weight.

## Boundaries
- Rules are configuration inputs, not an authorization mechanism.
- The matching engine remains responsible for interpreting rules and validating field/value compatibility.
- Category selection and rule evaluation are separate domains.
- Stable keys are not purchaser-facing labels.

## Next integration
After checking existing Quick Launch contracts, add optional matchingRules metadata, purchaser controls, review/publish snapshot summaries, and focused compatibility tests.
