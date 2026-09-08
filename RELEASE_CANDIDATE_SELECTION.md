# Release Candidate Selection Record

## Candidate selection rule
A release candidate is a specific immutable commit SHA. Do not call the moving main branch a release candidate.

## Selected candidate

- Candidate: Version 1.0 RC1
- Commit SHA: 6122475dba34a44ac03b67b9a6a528d46fc0f532
- Selection date: 2026-09-08
- CI run for predecessor release-preparation commits: successful
- CI for this exact status-record commit: run #4042 in progress at selection-record preparation time

## Evidence binding

All remaining manual evidence must be attached to the selected SHA:

- clean-environment installation
- documentation walkthrough
- Buyer Quick Launch acceptance
- advanced customization acceptance
- archive creation and checksum
- verified screenshots/demo capture

## Anti-drift rule

If main advances after candidate selection, do not silently transfer evidence to the newer commit. Either retain the selected SHA or restart affected evidence for a newly selected candidate.

## Final promotion rule

RC1 is not Version 1.0 until CI for the exact candidate and all applicable Phase 27/28 execution and owner gates are complete.
