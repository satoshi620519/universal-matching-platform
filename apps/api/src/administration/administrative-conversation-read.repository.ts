export interface AdministrativeConversationSummary {
  readonly id: string;
  readonly createdAt: Date;
  readonly participantCount: number;
  readonly messageCount: number;
  readonly lastMessageAt: Date | null;
}
export interface AdministrativeConversationPage {
  readonly items: readonly AdministrativeConversationSummary[];
  readonly nextCursor: string | null;
}
export abstract class AdministrativeConversationReadRepository {
  abstract list(input: { readonly cursor?: string; readonly limit: number }): Promise<AdministrativeConversationPage>;
}
