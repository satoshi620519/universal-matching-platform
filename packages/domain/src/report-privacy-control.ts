export type ReportPrivacyControl = 'visible' | 'suppressed' | 'aggregated';

export interface ReportPrivacyAssessment {
  readonly cohortSize: number;
  readonly minimumCohortSize: number;
  readonly containsSensitiveData: boolean;
}

export function resolveReportPrivacyControl(
  assessment: ReportPrivacyAssessment,
): ReportPrivacyControl {
  if (assessment.containsSensitiveData) {
    return 'suppressed';
  }

  if (assessment.cohortSize < assessment.minimumCohortSize) {
    return 'aggregated';
  }

  return 'visible';
}

export function isValidReportPrivacyAssessment(
  assessment: ReportPrivacyAssessment,
): boolean {
  return (
    Number.isInteger(assessment.cohortSize) &&
    assessment.cohortSize >= 0 &&
    Number.isInteger(assessment.minimumCohortSize) &&
    assessment.minimumCohortSize > 0
  );
}
