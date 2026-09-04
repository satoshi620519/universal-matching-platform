import { ConflictException, Injectable } from '@nestjs/common';
import { createUserBlock, type UserBlock } from '@universal/domain';
import { DatabaseService } from '../database/database.service.js';
import { UserBlockRepository } from './user-block.repository.js';

@Injectable()
export class PrismaUserBlockRepository extends UserBlockRepository {
  constructor(private readonly database: DatabaseService) { super(); }

  async create(blockerAccountId: string, blockedAccountId: string, createdAt = new Date()): Promise<UserBlock> {
    const block = createUserBlock({ blockerAccountId, blockedAccountId }, createdAt.toISOString());
    const inserted = await this.database.$executeRaw`
      INSERT INTO "user_blocks" ("blocker_account_id", "blocked_account_id", "created_at")
      VALUES (${block.blockerAccountId}::uuid, ${block.blockedAccountId}::uuid, ${block.createdAt}::timestamptz)
      ON CONFLICT ("blocker_account_id", "blocked_account_id") DO NOTHING
    `;
    if (inserted === 0) throw new ConflictException('user block already exists');
    return block;
  }

  async remove(blockerAccountId: string, blockedAccountId: string): Promise<boolean> {
    const result = await this.database.$executeRaw`
      DELETE FROM "user_blocks"
      WHERE "blocker_account_id" = ${blockerAccountId}::uuid
        AND "blocked_account_id" = ${blockedAccountId}::uuid
    `;
    return result > 0;
  }

  async exists(blockerAccountId: string, blockedAccountId: string): Promise<boolean> {
    const rows = await this.database.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS(
        SELECT 1 FROM "user_blocks"
        WHERE "blocker_account_id" = ${blockerAccountId}::uuid
          AND "blocked_account_id" = ${blockedAccountId}::uuid
      ) AS "exists"
    `;
    return rows[0]?.exists === true;
  }
}
