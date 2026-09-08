# Buyer Quick Launch Acceptance

## Purpose

This is the Phase 27 reproducible buyer-facing acceptance walkthrough for the existing Admin Quick Launch workflow.

## Existing evidence

The repository already contains the implementation and focused coverage:

- apps/admin/src/quick-launch-workflow.ts
- apps/admin/src/quick-launch-lifecycle.spec.ts
- apps/admin/src/quick-launch-workflow.spec.ts
- apps/admin/src/quick-launch-configuration-summary.integration.spec.ts
- apps/api/src/configuration/quick-launch-configuration.service.test.ts
- ADMIN_GUIDE.md
- QUICK_START.md

The lifecycle is already covered as create → save draft → publish → current published configuration → history.

## Acceptance procedure

1. Start the platform using QUICK_START.md.
2. Sign in through the authorized administrative path.
3. Complete the 11 Quick Launch sections:
   Branding, Regions, Categories, Profile Schema, Matching Categories, Features, Legal & Support, Terminology, Matching Rules, Onboarding, Review & Publish.
4. Save the configuration as a draft.
5. Review the generated configuration summary.
6. Publish the reviewed configuration.
7. Confirm the active published version.
8. Open history and confirm the publication record is retained.
9. Make a subsequent configuration change and confirm it remains a draft until explicitly published as a new immutable version.

## Expected result

A non-developer purchaser can configure the supported product surface without editing core source code. Draft changes are not active until publication, and published versions remain historical records.

## Evidence boundary

Focused lifecycle and integration tests provide automated contract evidence. Final release-candidate evidence still requires this walkthrough against the selected release commit in a running environment.
