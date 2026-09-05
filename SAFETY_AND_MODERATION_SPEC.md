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

## Moderation actions slice checkpoint
### Existing implementation found
- SafetyModerationService already supports report triage, moderation cases, administrative capability checks, audit records, and enforcement restrictions.
- SafetyModerationController already exposes authenticated administrative endpoints.
- Existing actions include warning, feature restriction, communication restriction, suspension, and close-without-action.

### Next verification boundary
Do not recreate moderation actions. Inspect the existing domain action-to-restriction mapping, enforcement persistence, and tests to identify only missing invariants (especially expiry and irreversible/revocable enforcement semantics) before adding code.


## Next slice decision — Evidence and context capture
### Why this slice
- User Block, Reporting, Moderation Actions, and Moderation Queue are CI-verified and frozen.
- Roadmap still requires evidence/context capture, ban, audit logs, abuse prevention, rate limiting, and spam controls.
- Repository search found no existing canonical evidence/context or attachment model, so this is the smallest missing upstream moderation primitive to establish before policy-heavy ban/rate/spam work.

### Scope boundary
- Add a reusable report evidence/context domain contract and persistence boundary.
- Evidence metadata only; do not introduce a media-storage provider, upload pipeline, AI moderation, or admin UI in this slice.
- Evidence must be tied to an existing report and preserve immutable capture metadata needed for later moderation review.

### Next exact action
Inspect domain conventions and Prisma migration patterns, then implement evidence/context contracts and persistence as the next focused vertical slice.


## Next slice decision — Irreversible ban semantics
### Why this slice
- Evidence Capture Write is CI-verified and frozen.
- Existing moderation actions already cover warning, feature/communication restriction and suspension, so recreating the actions subsystem would duplicate work.
- The roadmap explicitly requires ban, and the existing action checkpoint identifies irreversible/revocable enforcement semantics as the remaining invariant boundary.

### Scope boundary
- Inspect existing enforcement domain and action-to-restriction mapping first.
- Add only the missing permanent/ban semantics and focused invariants.
- Reuse existing administrative authorization, moderation case, enforcement persistence, and audit seams.
- Do not build a second moderation action service or admin UI.

### Next exact action
Inspect SafetyEnforcement domain contracts, persistence schema, and existing moderation action mappings to identify the smallest concrete ban gap before changing code.


## Next slice decision — Abuse prevention foundation
### Why this slice
- User Block, Reporting, Moderation Queue, Evidence Capture, and Ban semantics are CI-verified and frozen.
- The remaining explicit Phase 12 gap is abuse prevention: rate limiting and spam controls.
- Repository search found no existing rate-limit, throttling, or spam-control primitive, so duplication risk is low but scope must begin with a reusable foundation rather than endpoint-specific patches.

### Scope boundary
- First establish a canonical, deterministic abuse-control contract suitable for reuse by authentication, reporting, messaging, and discovery.
- Separate policy definition from transport/framework adapters.
- Do not add third-party infrastructure or broad endpoint wiring until the domain/application contract and focused tests establish semantics.

### Next exact action
Inspect dependency conventions and request identity seams, then implement the smallest in-memory/testable abuse-control policy boundary with explicit key, window, and rejection semantics.
