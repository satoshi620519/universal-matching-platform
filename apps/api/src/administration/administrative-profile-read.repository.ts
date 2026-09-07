export interface AdministrativeProfileSummary {
  readonly id: string;
  readonly accountId: string;
  readonly categoryId: string;
  readonly scopeKind: string;
  readonly verificationStatus: string;
  readonly avatarStatus: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface AdministrativeProfilePage {
  readonly items: readonly AdministrativeProfileSummary[];
  readonly nextCursor: string | null;
}

export abstract class AdministrativeProfileReadRepository {
  abstract list(input: { readonly cursor?: string; readonly limit: number }): Promise<AdministrativeProfilePage>;
}
