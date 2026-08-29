# Domain Model

## Status
Phase 2 architecture artifact — initial canonical model.

## Architectural rule
Each domain concept has one authoritative ownership boundary. Other modules reference stable identifiers or explicit contracts rather than duplicating mutable state.

## Bounded contexts
### Identity and Account
Owns accounts, account lifecycle, authentication identities and account status.

### Profile
Owns public/category-specific profiles, visibility, completion and schema-versioned answers.

### Category and Configuration
Owns category definitions and configuration for profile schemas, matching, discovery, regional behavior and enabled capabilities.

### Geography and Localization
Owns geographic hierarchy, service areas and locale metadata. Precise location remains privacy-sensitive.

### Discovery and Matching
Owns candidate eligibility, strategy execution and match lifecycle.

### Messaging
Owns conversations, participants, messages and delivery/read lifecycle; consults centralized authorization.

### Notifications
Owns notification intent, preferences and delivery attempts.

### Commerce and Entitlements
Owns product plans, purchase references, subscriptions and entitlement lifecycle. Providers remain adapters.

### Identity Verification
Owns verification requests, levels, lifecycle and authoritative outcomes; raw evidence has restricted handling.

### Trust and Safety
Owns blocks, reports, moderation cases, enforcement actions and appeals.

### Authorization
Owns capability definitions, policy composition and authoritative protected-action decisions.

### Administration and Audit
Owns administrative roles, operational scopes and append-oriented audit records.

### Analytics
Owns event taxonomy, approved analytics events, aggregations and reporting definitions.

### Media
Owns media metadata, lifecycle and access references; object storage is infrastructure.

## Canonical entities and lifecycles
- Account: pending → active → restricted/suspended → closed
- Profile: draft → published → hidden/archived
- Match: proposed → active → ended/invalidated
- Conversation: active → restricted/closed
- Message: created → delivered → read, with policy-controlled removal/restriction
- Entitlement: pending → active → suspended/revoked → expired
- VerificationRequest: initiated → pending → verified/failed/expired
- ModerationCase: open → triaged → assigned → under_review → resolved → closed
- EnforcementAction: scoped action with authority, reason and effective period
- Appeal: submitted → under_review → upheld/modified/reversed/closed

## Major relationships
Account
- AuthenticationIdentity (1..n)
- Profile (1..n, policy controlled)
- Entitlement (0..n)
- VerificationRequest (0..n)
- Block (0..n)
- Report (0..n)
- EnforcementAction (0..n as subject)

Profile
- Category (n..1)
- GeographicArea (0..n, policy controlled)
- MediaAsset (0..n)

Match
- participant accounts/profiles
- Conversation (0..1 or policy-controlled)

Conversation
- ConversationParticipant (2..n)
- Message (0..n)

Purchase
- Entitlement (0..n)

ModerationCase
- Report (1..n)
- EnforcementAction (0..n)
- Appeal (0..n)

## Cross-context rules
1. Contexts reference stable IDs instead of importing another context's mutable model.
2. Protected actions call Authorization rather than reimplementing payment, verification or safety checks.
3. Safety can restrict capabilities without deleting commercial history.
4. Configuration changes do not rewrite historical transactional facts.
5. Provider callbacks are translated into domain contracts before changing core state.
6. Analytics consumes approved events and never becomes a transaction dependency.
7. Audit observes authorized changes without owning business state.

## Candidate domain events
- AccountActivated
- AccountRestricted
- ProfilePublished
- ProfileVisibilityChanged
- MatchCreated
- MatchEnded
- ConversationCreated
- MessageCreated
- MessageDelivered
- PurchaseConfirmed
- EntitlementActivated
- EntitlementRevoked
- VerificationCompleted
- ReportSubmitted
- ModerationCaseEscalated
- EnforcementApplied
- EnforcementReversed
- AppealResolved
- ConfigurationPublished

Events are contracts, not a requirement for unrestricted event sourcing. Transactional PostgreSQL state remains authoritative.

## Open questions for data modeling
1. Default Version 1.0 policy for multiple profiles per account.
2. Whether matching is profile-to-profile, account-to-account, or strategy-selectable.
3. Conversation eligibility after a match ends.
4. Which capability definitions are globally fixed versus deployment-configurable.
5. Which historical profile/configuration snapshots must be preserved for moderation and audit.

## Exact next step
Create DATA_MODEL_DRAFT.md mapping canonical entities to relational ownership, keys, cardinalities, sensitive-data boundaries, indexes and migration principles.
