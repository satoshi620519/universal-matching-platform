## Phase 13 account lookup privacy boundary — 2026-09-05
- Continued from the recorded AccountLookup review without re-auditing already protected admin surfaces.
- AccountLookupService returns only AccountRecord fields: id, status, createdAt, updatedAt; no email, credentials, profile details, tokens, or other secret fields are exposed by this DTO boundary.
- The endpoint was nevertheless unauthenticated and accepted arbitrary accountId, creating an unnecessary account-existence/status disclosure surface.
- Added the existing RequestPrincipalResolver authentication boundary before AccountLookupService is called. No new authorization system or data model was introduced.
- Added focused regression tests: unauthenticated lookup is rejected before repository/service access; authenticated lookup continues through the existing service.
- Commits: 27362b114f9305326b6e2812b7538fa82480ceae, 60edb5f395bf038797acb90011a7c1df9714d1e9.
- Next exact action: inventory the remaining externally exposed account/profile controllers only once, identify whether any return non-public fields or bypass existing safety/privacy policies, and patch only concrete exposure gaps.
