# Mobile Protected Navigation Contract

## Purpose
Separate navigation capability from backend feature implementation. This allows the authenticated mobile shell to become structurally complete without inventing discovery, profile, or matching endpoints.

## Public destinations
- sign-in
- registration (reserved until backend contract is confirmed)
- verification (reserved until backend contract is confirmed)

## Authenticated destinations
- home
- discovery
- matches
- conversations
- profile
- settings
- safety

## Guard rule
A destination requiring authentication must never rely solely on a hidden button. The navigation boundary receives session state and rejects protected destinations when the session is unauthenticated.

## Deep-link rule
Incoming deep links are parsed into known destination identifiers. Unknown or malformed destinations are rejected. Authentication is checked after parsing and before rendering protected content.

## Implementation sequence
1. Add framework-independent destination model.
2. Add authenticated shell state.
3. Introduce Expo Router only when runtime dependencies are installed and version-pinned.
4. Connect each destination to existing backend contracts only after confirming endpoint/DTO availability.

## Non-goal
This document does not claim that protected navigation replaces backend authorization. Server-side authorization remains mandatory.
