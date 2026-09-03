# Matching Category Configuration

Matching categories let a buyer adapt one deployment to different matching contexts without changing source code.

Examples:
- dating
- friendship
- networking
- mentorship
- hobby/community

## Contract
Each category has a stable deployment key, purchaser-facing label, optional description, and enabled state.

## Boundaries
- Categories classify matching context; they do not themselves implement matching algorithms.
- Rules and scoring remain a separate Configuration Engine domain.
- Internal category keys are deployment configuration identifiers and must be validated before persistence/API use.
- Normalization rejects blank or duplicate keys and labels.

## Next integration
Integrate optional category metadata into Quick Launch, review/publish snapshots, and purchaser controls after checking existing branch work to avoid duplication.
