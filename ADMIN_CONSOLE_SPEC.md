# ADMIN CONSOLE SPECIFICATION

## Purpose
Define the Phase 13 administration console before implementation. The console must let a product buyer operate a deployment without normal operational changes requiring source-code edits.

## Design principles
- Least privilege and capability-based authorization.
- Administrative reads and mutations are auditable.
- Sensitive content is minimized and shown only when policy permits.
- Dangerous actions require explicit confirmation and reason capture where appropriate.
- Configuration changes are validated before activation.
- The console remains universal: no assumptions specific to dating.

## Roles
1. Super Admin — platform-wide configuration and administrator management.
2. Operations Admin — users, profiles, moderation workflow and operational controls.
3. Moderator — assigned moderation queues and permitted enforcement actions.
4. Analyst — privacy-safe analytics and read-only operational insight.
5. Support — limited user lookup and support-safe actions.

Capabilities, rather than UI role names alone, are the authorization source of truth.

## Sections and minimum scope
### Dashboard
- registrations and active-user summaries
- moderation queue counts and SLA indicators
- matching and conversation activity summaries
- system health summary
- recent administrative activity

### Users and Profiles
- search/filter users
- lifecycle/status view
- verification and enforcement state
- profile review
- privacy-safe administrative lookup
- links to related moderation and audit records

### Reports and Moderation
- queue by state, category, priority and assignee
- evidence/context review within authorization boundary
- warnings, suspensions and bans through existing moderation domain rules
- transition history and immutable audit correlation

### Matches and Conversation Metadata
- operational metadata only by default
- no unrestricted message-content browsing
- escalation paths must obey legal/policy configuration and audit requirements

### Geography and Configuration
- countries/regions/localities
- feature flags
- terminology and localization
- theme/branding
- matching configuration
- deployment-safe validation and rollback strategy

### Analytics
- privacy-conscious aggregates
- registrations, active users, profile completion, discovery activity
- matches, conversation starts, retention events
- moderation statistics
- no unnecessary personal-data export

### Audit and System Health
- searchable administrative audit trail
- actor, capability, target, action, reason and correlation identifiers
- dependency/job/queue health indicators
- failed background work visibility where supported

## API boundary
Administrative endpoints must:
- require authenticated administrator identity;
- enforce capability authorization server-side;
- validate input independently of the UI;
- paginate large collections;
- avoid exposing secrets or precise private location by default;
- create audit records for mutations and sensitive reads where policy requires;
- use explicit error semantics suitable for an admin UI.

## Implementation order
1. Inventory existing administrative authorization, moderation and audit APIs.
2. Define a stable admin API contract and capability matrix.
3. Build read-only dashboard and queue views.
4. Add controlled mutations with confirmation and audit capture.
5. Add configuration and feature-flag management.
6. Add analytics and system-health views.
7. Add role/capability tests, API tests and end-to-end admin flows.

## Phase 13 completion criteria
- All listed sections have defined ownership and authorization boundaries.
- Normal administration can be performed without source edits.
- Existing safety/moderation controls are reused rather than duplicated.
- Every privileged mutation is auditable.
- Sensitive data exposure follows explicit policy.
- Core admin flows have automated regression coverage.
- Buyer documentation explains administrator setup and operations.

## Non-goals for the first implementation slice
- A new parallel moderation engine.
- Unrestricted access to private message content.
- Deployment-specific hard-coded roles.
- Analytics requiring third-party SaaS.
