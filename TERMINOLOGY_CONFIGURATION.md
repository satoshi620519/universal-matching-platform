# Terminology Configuration Domain

Terminology is configurable because the platform must support dating, friendship, mentorship, networking, and other matching products without source-code edits.

## Initial stable keys
- user
- profile
- discovery
- match
- matches
- message
- messages

Keys are stable implementation identifiers. Buyers customize labels, not keys.

## Boundaries
- Terminology changes presentation language only.
- It does not rename database entities, API fields, authorization roles, or audit records.
- Localization remains responsible for translating configured/default labels per locale.
- Empty labels are discarded and callers retain explicit fallbacks.

## Quick Launch integration
The next slice should add optional terminology metadata to QuickLaunchDraftInput and the existing immutable publication lifecycle, followed by purchaser UI.
