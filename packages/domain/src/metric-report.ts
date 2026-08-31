import type { ReportingPeriod } from './metric-definition.js';

export type MetricAvailability = 'available' | 'unavailable';
export type MetricReportScope = 'global' | 'region' | 'category';

export interface MetricReport {
  readonly metricName: string;
  readonly metricVersion: number;
  readonly period: ReportingPeriod;
  readonly scope: MetricReportScope;
  readonly availability: MetricAvailability;
  readonly value?: number;
}

export function isValidMetricReport(report: MetricReport): boolean {
  if (
    !/^[a-z][a-z0-9_]*$/.test(report.metricName) ||
    !Number.isInteger(report.metricVersion) ||
    report.metricVersion <= 0
  ) {
    return false;
  }

  if (report.availability === 'available') {
    return typeof report.value === 'number' && Number.isFinite(report.value);
  }

  return report.value === undefined;
}

export function isZeroValue(report: MetricReport): boolean {
  return report.availability === 'available' && report.value === 0;
}
