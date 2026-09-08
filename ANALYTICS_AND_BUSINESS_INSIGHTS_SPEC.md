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

## Explicit acceptance gap
Metric definitions and reporting surfaces exist, but Phase 14 completion requires verifying that each defined business event is emitted from its authoritative domain transition. Missing producers must be wired at those transitions rather than reconstructed later from UI behavior.
