# Safety and Moderation Specification

## Phase 12 implementation order
The safety surface is delivered as independently verifiable vertical slices:

1. User Block — complete and CI verified
2. Reporting — user/content reports, categories, immutable evidence context
3. Moderation actions — warning, suspension, ban
4. Moderation queue and administration
5. Abuse prevention — rate limiting and spam controls
6. Audit log infrastructure shared by moderation actions

## Reporting slice
### Goals
- An authenticated account can report a user or supported content.
- Reports use deployment-configurable categories rather than dating-specific assumptions.
- Evidence/context is captured at submission time and preserved for moderation review.
- Reporter identity is authenticated server-side.
- Reported subject references are explicit and typed.

### Core invariants
- A report cannot target the reporter as a user target.
- Category must be active and valid.
- Context is append-only once submitted.
- Reports are not deleted by ordinary user operations.
- Duplicate reports are allowed but remain independently auditable.
- Reporting must not expose reporter identity to the reported user.

### Minimal data model
- safety_report_categories
- safety_reports
- safety_report_evidence

### Status lifecycle
submitted -> triaged -> actioned | dismissed

### Boundary
Do not build the moderation queue UI in this slice. First establish domain contracts, persistence, authenticated submission API, and focused verification.
