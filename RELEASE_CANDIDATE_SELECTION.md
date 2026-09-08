# Release Candidate Selection Record

## Candidate selection rule

A release candidate is a specific immutable commit SHA. Do not call the moving main branch a release candidate.

## Selection prerequisites

- CI for the exact SHA completed successfully.
- The SHA contains all intended Version 1.0 repository-side release documentation.
- No known unresolved repository defect is being waived.

## Evidence record

Before tagging, record:

- candidate commit SHA
- commit timestamp
- CI run number
- CI conclusion
- selected-by date
- remaining manual gates

## Current status

No Version 1.0 candidate is selected yet.

The latest documentation commits must finish CI first. After success, select one exact SHA and use that same SHA for clean-environment installation, Buyer Quick Launch acceptance, advanced customization acceptance, archive creation and verified screenshot capture.

## Anti-drift rule

If main advances after candidate selection, do not silently transfer evidence to the newer commit. Either retain the selected SHA or restart affected evidence for a newly selected candidate.
