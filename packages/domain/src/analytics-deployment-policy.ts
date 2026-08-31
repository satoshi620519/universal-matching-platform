export type AnalyticsRetentionPeriod = 7 | 30 | 90 | 365;

export interface AnalyticsDeploymentPolicy {
  readonly retentionDays: AnalyticsRetentionPeriod;
  readonly nonEssentialAnalyticsEnabled: boolean;
}

const supportedRetentionPeriods: readonly AnalyticsRetentionPeriod[] = [
  7,
  30,
  90,
  365,
];

export function supportsAnalyticsRetentionPeriod(
  retentionDays: number,
): retentionDays is AnalyticsRetentionPeriod {
  return supportedRetentionPeriods.includes(
    retentionDays as AnalyticsRetentionPeriod,
  );
}

export function isValidAnalyticsDeploymentPolicy(
  policy: AnalyticsDeploymentPolicy,
): boolean {
  return supportsAnalyticsRetentionPeriod(policy.retentionDays);
}

export function shouldCollectNonEssentialAnalytics(
  policy: AnalyticsDeploymentPolicy,
): boolean {
  return policy.nonEssentialAnalyticsEnabled;
}
