import { type MetricDefinition } from '@universal/domain';

export const analyticsMetricDefinitions: readonly MetricDefinition[] = [
  { name: 'registrations', version: 1, scope: 'product', calculation: 'Count registration_completed events.', supportedPeriods: ['day','week','month','quarter','year'], sourceEvents: ['registration_completed'] },
  { name: 'active_users', version: 1, scope: 'product', calculation: 'Count distinct accountId values from activity events when identity is explicitly permitted in the metric source.', supportedPeriods: ['day','week','month','quarter','year'], sourceEvents: ['activity'] },
  { name: 'profile_completion', version: 1, scope: 'product', calculation: 'Count profile_completed events.', supportedPeriods: ['day','week','month','quarter','year'], sourceEvents: ['profile_completed'] },
  { name: 'discovery_activity', version: 1, scope: 'product', calculation: 'Count discovery_viewed events.', supportedPeriods: ['day','week','month','quarter','year'], sourceEvents: ['discovery_viewed'] },
  { name: 'matches', version: 1, scope: 'product', calculation: 'Count match_created events.', supportedPeriods: ['day','week','month','quarter','year'], sourceEvents: ['match_created'] },
  { name: 'conversation_starts', version: 1, scope: 'product', calculation: 'Count conversation_started events.', supportedPeriods: ['day','week','month','quarter','year'], sourceEvents: ['conversation_started'] },
  { name: 'retention_events', version: 1, scope: 'product', calculation: 'Count retention_checkin events.', supportedPeriods: ['day','week','month','quarter','year'], sourceEvents: ['retention_checkin'] },
];
