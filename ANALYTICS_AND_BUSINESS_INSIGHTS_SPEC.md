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
- [ ] registration_completed — authoritative account registration transition
- [ ] activity — authoritative authenticated activity transition
- [ ] profile_completed — authoritative profile completion transition
- [ ] discovery_viewed — authoritative discovery result transition
- [ ] match_created — authoritative match creation transition
- [ ] conversation_started — authoritative conversation creation transition
- [ ] retention_checkin — authoritative once-per-account-per-UTC-day transition
