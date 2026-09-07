export interface AdministrativeAuditRecordSummary {
  readonly id: string;
  readonly actorId: string;
  readonly area: string;
  readonly action: string;
  readonly targetId: string | null;
  readonly correlationId: string | null;
  readonly occurredAt: Date;
}
export interface AdministrativeAuditPage {
  readonly items: readonly AdministrativeAuditRecordSummary[];
  readonly nextCursor: string | null;
}
export abstract class AdministrativeAuditReadRepository {
  abstract list(input: { readonly cursor?: string; readonly limit: number }): Promise<AdministrativeAuditPage>;
}
