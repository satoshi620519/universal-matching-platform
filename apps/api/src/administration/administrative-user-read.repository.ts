export interface AdministrativeUserSummary {
  readonly id: string;
  readonly status: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface AdministrativeUserPage {
  readonly items: readonly AdministrativeUserSummary[];
  readonly nextCursor: string | null;
}

export abstract class AdministrativeUserReadRepository {
  abstract list(input: {
    readonly cursor?: string;
    readonly limit: number;
  }): Promise<AdministrativeUserPage>;
}
