export interface RelationshipBlockRecord { readonly blockerAccountId: string; readonly blockedAccountId: string; readonly createdAt: Date; }
export abstract class RelationshipBlockRepository {
  abstract create(blockerAccountId: string, blockedAccountId: string): Promise<RelationshipBlockRecord>;
  abstract existsBetween(firstAccountId: string, secondAccountId: string): Promise<boolean>;
}
