# Demo Seed Baseline

## Purpose

This baseline defines the minimum deterministic fictional dataset for Phase 22 demo deployment. It is intentionally small so a buyer can understand the system without maintaining a large fixture corpus.

## Accounts

The baseline contains four fictional accounts:

- member-a: completed profile and discovery candidate
- member-b: completed profile and mutual-match counterpart
- member-c: completed profile with a different profile shape for discovery variety
- administrator: normal administrative capability path

No real identity, email address, photo, credential, API key, or production secret belongs in the baseline.

## Demonstrable journeys

The seeded environment must support:

1. profile/discovery
2. mutual match
3. conversation
4. notification
5. normal administrative access

The seed plan deliberately maps to existing account, profile, matching, messaging, notification, and administration boundaries instead of introducing demo-only tables or authorization.

## Implementation boundary

The current repository now has an explicit seed plan and environment guard. The next implementation step is to connect the plan to the existing persistence/repository contracts after verifying a deterministic insertion path that does not bypass domain invariants.

No destructive reset operation is enabled by this document.
