import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { RelationshipBlockRepository, type RelationshipBlockRecord } from './relationship-block.repository.js';

@Injectable()
export class PrismaRelationshipBlockRepository extends RelationshipBlockRepository {
  constructor(private readonly database: DatabaseService) { super(); }
  async create(blockerAccountId: string, blockedAccountId: string): Promise<RelationshipBlockRecord> {
    return this.database.relationshipBlock.upsert({
      where: { blockerAccountId_blockedAccountId: { blockerAccountId, blockedAccountId } },
      create: { blockerAccountId, blockedAccountId },
      update: {},
      select: { blockerAccountId: true, blockedAccountId: true, createdAt: true },
    });
  }
  async existsBetween(firstAccountId: string, secondAccountId: string): Promise<boolean> {
    return !!(await this.database.relationshipBlock.findFirst({
      where: { OR: [{ blockerAccountId: firstAccountId, blockedAccountId: secondAccountId }, { blockerAccountId: secondAccountId, blockedAccountId: firstAccountId }] },
      select: { id: true },
    }));
  }
}
