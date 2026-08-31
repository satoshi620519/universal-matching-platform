export type AnalyticsRole = 'viewer' | 'analyst' | 'administrator';
export type AnalyticsOperation =
  | 'view'
  | 'export'
  | 'configure-dashboard'
  | 'configure-retention'
  | 'disable-non-essential';

export interface AnalyticsAccessPolicy {
  readonly role: AnalyticsRole;
  readonly operation: AnalyticsOperation;
  readonly allowed: boolean;
}

const allowedOperations: Readonly<Record<AnalyticsRole, readonly AnalyticsOperation[]>> = {
  viewer: ['view'],
  analyst: ['view', 'export'],
  administrator: [
    'view',
    'export',
    'configure-dashboard',
    'configure-retention',
    'disable-non-essential',
  ],
};

export function canPerformAnalyticsOperation(
  role: AnalyticsRole,
  operation: AnalyticsOperation,
): boolean {
  return allowedOperations[role].includes(operation);
}

export function isValidAnalyticsAccessPolicy(
  policy: AnalyticsAccessPolicy,
): boolean {
  return policy.allowed === canPerformAnalyticsOperation(policy.role, policy.operation);
}
