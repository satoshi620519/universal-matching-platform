export interface AdministrativeModerationReportSummary {
  readonly id: string;
  readonly targetId: string;
  readonly targetType: string;
  readonly status: string;
  readonly createdAt: Date;
}

export interface AdministrativeModerationCaseSummary {
  readonly id: string;
  readonly reportId: string;
  readonly status: string;
  readonly createdAt: Date;
}

export interface AdministrativeModerationPage<T> {
  readonly items: readonly T[];
  readonly nextCursor: string | null;
}

export abstract class AdministrativeModerationReadRepository {
  abstract listReports(input: { readonly cursor?: string; readonly limit: number }): Promise<AdministrativeModerationPage<AdministrativeModerationReportSummary>>;
  abstract listCases(input: { readonly cursor?: string; readonly limit: number }): Promise<AdministrativeModerationPage<AdministrativeModerationCaseSummary>>;
}
