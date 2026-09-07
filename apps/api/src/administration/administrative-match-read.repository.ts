export interface AdministrativeMatchInteractionSummary {
  readonly id: string;
  readonly actorAccountId: string;
  readonly targetAccountId: string;
  readonly decision: string;
  readonly createdAt: Date;
}
export interface AdministrativeMatchInteractionPage {
  readonly items: readonly AdministrativeMatchInteractionSummary[];
  readonly nextCursor: string | null;
}
export abstract class AdministrativeMatchReadRepository {
  abstract list(input: { readonly cursor?: string; readonly limit: number }): Promise<AdministrativeMatchInteractionPage>;
}
