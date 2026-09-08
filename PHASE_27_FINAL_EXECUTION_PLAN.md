# Phase 27 Final Execution Plan

Phase 27 is closed only with evidence from one selected release-candidate commit. Execute in this order.

## Automated evidence

1. Select the candidate commit SHA.
2. Confirm the CI run for that exact SHA completes successfully.
3. Record the CI run number and completion time.

## Human reproducibility evidence

4. Use a clean environment.
5. Follow INSTALLATION.md exactly.
6. Follow QUICK_START.md without undocumented steps.
7. Record commands, deviations, failures, and final result.

## Buyer acceptance evidence

8. Execute BUYER_QUICK_LAUNCH_ACCEPTANCE.md.
9. Execute ADVANCED_CUSTOMIZATION_ACCEPTANCE.md.
10. Record the candidate SHA and pass/fail result for each.

## Commercial evidence

11. Approve and add the final commercial LICENSE.
12. Run a final secret/private-artifact scan.
13. Assemble the archive according to RELEASE_ARCHIVE_MANIFEST.md.
14. Record archive checksum.

## Sales evidence

15. Capture verified screenshots using COMMERCIAL_PACKAGING.md.
16. Only add a demo URL if an actual deployed demo is reachable.
17. Re-check marketplace seller, payout, category and license requirements at publication time.

## Final gate

Only after all applicable evidence is attached to the same release candidate should the product be marked marketplace-ready.
