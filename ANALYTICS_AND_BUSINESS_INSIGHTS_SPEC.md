# Analytics and Business Insights Specification

## Purpose
Phase 14 reuses the existing append-only AnalyticsEvent store and safety-report aggregates. It must not duplicate operational domain records into a second analytics database.

## Metric sources
- registrations: registration_completed
- active users: distinct accountId values from activity events
- profile completion: profile_completed
- discovery activity: discovery_viewed
- matches: match_created
- conversation starts: conversation_started
- retention: one retention_checkin per account per UTC day
- moderation statistics: authoritative SafetyReport aggregation

## Data boundary
Business analytics payloads may carry only identifiers or dimensions required for aggregation. Credentials, message bodies, profile biographies, precise coordinates, verification secrets, and raw report evidence are forbidden.

## Collection policy
Operational events are always subject to contract validation. Non-essential business analytics must respect AnalyticsDeploymentPolicy.

## Reporting
All reports are capability-gated through view-analytics and support day, week, month, quarter, and year periods. Event ingestion remains server-side; clients must not authoritatively increment business metrics.

## Explicit acceptance verification
Authoritative transition wiring was audited against the repository surface. The analytics contracts and reporting consumers are present, while the repository does not currently expose a complete producer layer for the defined business events. Phase 14 therefore remains open until each product transition has a concrete server-side producer; events must not be reconstructed from UI behavior or report queries.

## Producer checklist
- [x] registration_completed — PasswordRegistrationService after successful account creation
- [x] activity — RequestPrincipalResolver after successful authenticated principal resolution
- [x] profile_completed — ProfileService after successful profile persistence
- [x] discovery_viewed — DiscoveryService after successful result projection
- [x] match_created — PrismaMatchTransitionRepository on first mutual match only
- [x] conversation_started — MessagingController after successful new conversation creation
- [x] retention_checkin — RequestPrincipalResolver authenticated lifecycle invokes UTC-day-idempotent recorder
