export type MetricScope = 'product' | 'commercial' | 'safety';
export type ReportingPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface MetricDefinition {
  readonly name: string;
  readonly version: number;
  readonly scope: MetricScope;
  readonly calculation: string;
  readonly supportedPeriods: readonly ReportingPeriod[];
  readonly sourceEvents: readonly string[];
}

export function isValidMetricDefinition(
  definition: MetricDefinition,
): boolean {
  return (
    /^[a-z][a-z0-9_]*$/.test(definition.name) &&
    Number.isInteger(definition.version) &&
    definition.version > 0 &&
    definition.calculation.trim().length > 0 &&
    definition.supportedPeriods.length > 0 &&
    definition.sourceEvents.length > 0
  );
}

export function supportsReportingPeriod(
  definition: MetricDefinition,
  period: ReportingPeriod,
): boolean {
  return definition.supportedPeriods.includes(period);
}
