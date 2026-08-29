# Data Model Draft

## Status
Phase 2 architecture artifact — relational model baseline.

## Purpose
This document maps DOMAIN_MODEL.md into relational ownership, identifiers, cardinalities, sensitive-data boundaries, indexing principles and migration rules. It is logical schema design, not yet vendor-specific SQL DDL.

## Global conventions
- PostgreSQL is the primary transactional database.
- Every durable entity uses a stable opaque primary identifier.
- Public APIs must not expose sequential database identifiers.
- Timestamps use UTC and distinguish created/updated/deleted or effective periods where needed.
- Foreign keys express ownership relationships where lifecycle coupling requires it.
- Soft deletion is not a default; each domain explicitly chooses deletion, archival or anonymization.
- Sensitive fields are minimized and isolated from ordinary query paths.
- Historical facts are immutable or versioned where auditability requires it.

# 1. Identity and Account

## accounts
Primary key: account_id
Key fields:
- account_id
- status
- deployment_scope_id
- created_at
- updated_at
- closed_at

Indexes:
- (deployment_scope_id, status)
- created_at for operational ranges

Sensitive boundary: account table must not become a container for authentication secrets or verification evidence.

## authentication_identities
Primary key: authentication_identity_id
Foreign key: account_id → accounts
Unique candidate: (provider_type, provider_subject)
Fields include provider-neutral identity reference and lifecycle state.

Cardinality: Account 1 → N AuthenticationIdentity.

Credentials, refresh tokens and provider secrets are stored in dedicated secure mechanisms, not ordinary profile records.

# 2. Profiles and Categories

## categories
Primary key: category_id
Fields:
- category key
- enabled status
- current configuration version

Unique: deployment_scope_id + stable category key.

## category_configuration_versions
Primary key: configuration_version_id
Foreign key: category_id
Stores published configuration metadata and immutable/versioned payload references.

Cardinality: Category 1 → N configuration versions.

## profiles
Primary key: profile_id
Foreign keys:
- account_id
- category_id
- configuration_version_id

Fields:
- lifecycle/visibility state
- completion state
- published_at
- timestamps

Indexes:
- (account_id, category_id)
- (category_id, visibility_state)
- discovery-oriented composite indexes defined only after query patterns are measured.

## profile_field_values
Primary key: profile_field_value_id
Foreign key: profile_id
Key:
- schema field key
- typed/value representation
- visibility classification

Unique candidate: profile_id + field_key.

Sensitive fields must be separately classified; unrestricted JSON blobs are not the default persistence strategy.

# 3. Geography and localization

## geographic_areas
Primary key: geographic_area_id
Self-reference: parent_geographic_area_id
Fields:
- area type
- stable code where available
- localized naming reference

Indexes:
- parent_geographic_area_id
- type + stable code

## profile_geographic_scopes
Primary key: profile_geographic_scope_id
Foreign keys:
- profile_id
- geographic_area_id

Stores declared or privacy-filtered matching scope, not raw precision coordinates by default.

# 4. Matching

## matches
Primary key: match_id
Foreign keys:
- category_id
- strategy/version reference

Fields:
- state
- created_at
- ended_at
- end reason category

Indexes:
- category_id + state
- created_at

## match_participants
Primary key: match_participant_id
Foreign keys:
- match_id
- profile_id
- account_id

Unique: match_id + participant identity.

Cardinality: Match 1 → N participants.

Participant snapshots may be stored selectively when historical interpretation requires configuration stability.

## discovery_candidates
Derived/ephemeral storage.
Primary key: candidate_id or deterministic cache key.
Foreign keys/reference keys:
- requesting profile
- candidate profile
- strategy version

Retention is short-lived and explicitly configured.

# 5. Messaging

## conversations
Primary key: conversation_id
Fields:
- type
- state
- created_at
- closed_at

## conversation_participants
Composite uniqueness: conversation_id + account_id.
Fields:
- participant state
- joined_at
- last_read marker

## messages
Primary key: message_id
Foreign keys:
- conversation_id
- sender_account_id

Fields:
- content reference/classification
- created_at
- lifecycle state
- edited_at where supported

Indexes:
- conversation_id + created_at
- sender_account_id + created_at

Message content and moderation evidence may require separate protected storage classes.

# 6. Notifications

## notification_preferences
Primary key: preference_id
Unique: account_id + notification type/scope.

## notifications
Primary key: notification_id
Foreign key: account_id
Fields:
- intent type
- payload reference
- state
- scheduled_at
- created_at

## notification_deliveries
Primary key: delivery_id
Foreign key: notification_id
Fields:
- channel
- provider reference
- attempt state
- timestamps

# 7. Commerce and entitlements

## product_plans
Primary key: product_plan_id
Fields:
- stable product key
- region/deployment availability
- lifecycle state

## purchases
Primary key: purchase_id
Foreign keys:
- account_id
- product_plan_id

Fields:
- provider type
- external transaction reference
- state
- monetary snapshot
- currency
- timestamps

Unique: provider type + external transaction reference.

## entitlements
Primary key: entitlement_id
Foreign keys:
- account_id
- optional source purchase_id

Fields:
- capability/product reference
- state
- effective_from
- effective_until
- revocation reason category

Indexes:
- account_id + state + effective period
- capability key + state where needed for authorization evaluation.

Commercial provider payloads are not copied wholesale into core entitlement records.

# 8. Identity verification

## verification_requests
Primary key: verification_request_id
Foreign keys:
- account_id
- requested verification level

Fields:
- provider-neutral workflow reference
- state
- created_at
- completed_at
- expiry

## verification_outcomes
Primary key: verification_outcome_id
Foreign key: verification_request_id
Fields:
- authoritative level/result
- decision timestamp
- reason category

Raw documents, biometric artifacts and provider evidence must not be stored in this general-purpose table.

# 9. Trust and Safety

## blocks
Primary key: block_id
Foreign keys:
- actor_account_id
- blocked_account_id

Unique: actor_account_id + blocked_account_id.

## reports
Primary key: report_id
Foreign keys/references:
- reporter account nullable where anonymous/system reporting is allowed
- subject references represented by typed subject reference
- category/policy reference

Fields:
- intake status
- severity
- created_at

Indexes:
- intake status + severity + created_at
- subject reference + created_at

## moderation_cases
Primary key: moderation_case_id
Fields:
- state
- priority
- assignment reference
- opened_at
- resolved_at

## moderation_case_reports
Join table between cases and reports.

## enforcement_actions
Primary key: enforcement_action_id
Foreign keys:
- subject_account_id
- moderation_case_id nullable where automated action is allowed

Fields:
- action type
- scope
- reason category
- effective_from
- effective_until
- decision authority

Indexes:
- subject_account_id + effective state
- action type + effective period

## appeals
Primary key: appeal_id
Foreign keys:
- enforcement_action_id
- account_id

Fields:
- state
- submitted_at
- resolved_at
- resolution category

# 10. Authorization and administration

## roles
Primary key: role_id
Fields:
- stable role key
- scope

## role_assignments
Primary key: role_assignment_id
Foreign keys:
- account_id
- role_id

Fields:
- effective period
- assigning authority

## capability_definitions
Primary key: capability_id
Fields:
- stable capability key
- description
- policy classification

## capability_policy_versions
Primary key: policy_version_id
Stores versioned composition rules and deployment/category applicability.

Authorization decisions are generally computed; a decision-cache table may exist later but is not authoritative.

# 11. Audit

## audit_records
Primary key: audit_record_id
References:
- actor account/operator where applicable
- subject type/id
- action type

Fields:
- timestamp
- correlation identifier
- immutable metadata reference

Indexes:
- subject type + subject id + timestamp
- actor + timestamp
- action type + timestamp

Audit records are append-oriented and must not contain unrestricted sensitive payload copies.

# 12. Media

## media_assets
Primary key: media_asset_id
Foreign key:
- owner account/profile reference

Fields:
- storage object reference
- media type
- processing state
- access classification
- created_at

Object storage location is infrastructure detail. Signed URLs are generated by access policy rather than persisted as durable domain state.

# 13. Analytics

## analytics_events
Primary key: analytics_event_id
Fields:
- event name
- schema version
- approved actor/reference pseudonym
- timestamp
- approved payload

Indexes:
- event name + timestamp
- aggregation-specific dimensions only after privacy review.

Analytics events are not foreign-key coupled to every transactional table if that would prevent privacy-preserving retention; linkage strategy is explicit per event class.

# 14. Sensitive-data boundaries

Four handling classes:
1. Public/ordinary operational metadata.
2. Private user data.
3. Restricted safety/commercial operational data.
4. Highly sensitive verification evidence/secrets.

Rules:
- Authentication secrets never live in profile tables.
- Raw verification evidence is isolated from ordinary application queries.
- Message content access follows conversation and safety policy.
- Payment provider references are minimized; card/bank credentials are never application-owned.
- Audit and analytics payloads use minimization and redaction.
- Backups inherit the classification of source data.

# 15. Referential integrity principles

- Use database foreign keys for durable transactional ownership where deletion semantics permit.
- Avoid cross-context cascade deletes.
- Prefer explicit lifecycle transitions over destructive cascades.
- Join tables own many-to-many relationship metadata.
- Historical transactions retain references/snapshots necessary for audit even if user-facing content is deleted or anonymized.
- Partitioning is deferred until measured scale justifies it.

# 16. Indexing principles

Indexes must be justified by:
- authorization checks,
- critical user journeys,
- moderation queues,
- chronological conversation retrieval,
- entitlement evaluation,
- operational reporting.

Do not pre-index every foreign key blindly. Measure query plans during implementation and document intentional indexes.

# 17. Migration principles

1. Every schema change is version-controlled.
2. Expand/contract migrations are preferred for production-compatible changes.
3. Destructive changes require explicit data lifecycle and rollback consideration.
4. Long-running backfills must be observable and resumable.
5. Application and schema compatibility windows must be defined for staged deployments.
6. Seed/reference data has its own controlled migration strategy.
7. Configuration schema migrations are versioned independently from ordinary row migrations.

# Open questions before physical schema
- UUID/ULID choice and generation ownership.
- Exact partitioning thresholds for messages, audit and analytics.
- Full-text/search indexing boundary.
- Encryption-at-rest and field-level encryption requirements by deployment.
- Tenant/deployment isolation mechanism at database level.
- Whether category configuration values use normalized tables, constrained JSON columns, or hybrid storage.

# Exact next step
Create AUTHORIZATION_ARCHITECTURE.md defining request-time capability evaluation, policy inputs, precedence rules, caching boundaries and enforcement integration.
