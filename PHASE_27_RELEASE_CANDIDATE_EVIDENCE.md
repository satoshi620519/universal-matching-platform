# Phase 27 Release Candidate Evidence Matrix

This matrix maps each release-candidate requirement to existing evidence and identifies what still requires a real execution record.

| Requirement | Existing evidence | Status |
| --- | --- | --- |
| Complete QA | GitHub CI workflow: migration, typecheck, lint, tests, matching concurrency, mobile checks, build | Automated baseline present; release-commit run still required |
| Clean repository | RELEASE_ARCHIVE_MANIFEST.md and RELEASE_READINESS_CHECKLIST.md | Checklist present; final clean-archive inspection required |
| Remove secrets/demo credentials | Archive exclusion rules and SECURITY.md boundaries | Policy present; final release scan required |
| Install from scratch | INSTALLATION.md | Procedure present; clean-machine execution evidence required |
| Documentation from zero | INSTALLATION.md, QUICK_START.md, ADMIN_GUIDE.md, TROUBLESHOOTING.md | Documentation present; independent walkthrough evidence required |
| Buyer Quick Launch | QUICK_START.md plus Admin lifecycle contract tests | Functional contract evidence present; buyer-path walkthrough evidence required |
| Advanced customization | DEVELOPER_EXTENSIBILITY.md, CUSTOMIZATION_GUIDE.md | Contract documented; one reproducible extension example/acceptance record required |
| License package | LICENSE_DECISION_REQUIRED.md | BLOCKED pending owner-approved commercial license |
| Verified visual/demo evidence | COMMERCIAL_PACKAGING.md capture checklist | BLOCKED pending running release candidate and capture |

## Gate principle

Do not create duplicate tests merely to satisfy this matrix. Reuse existing CI and contract tests, then add evidence only where a human clean-environment or buyer walkthrough cannot be proven automatically.

## Recommended execution order

1. Resolve commercial license decision.
2. Tag/select a release candidate commit.
3. Run the existing CI pipeline against that exact commit.
4. Perform clean-environment installation and record commands/results.
5. Walk documentation and Buyer Quick Launch from zero.
6. Execute one supported advanced-customization example.
7. Capture verified screenshots from that same candidate.
8. Assemble a clean archive and record checksum.
9. Re-evaluate all release gates.
