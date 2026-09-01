import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service.js';

export type NotificationRecord = {
  id: string;
  accountId: string;
  kind: string;
  payload: unknown;
  createdAt: Date;
  readAt: Date | null;
};

@Injectable()
export class PrismaNotificationRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(input: {
    accountId: string;
    kind: string;
    payload: unknown;
  }): Promise<NotificationRecord> {
    return this.database.notification.create({ data: { ...input, payload: input.payload as Prisma.InputJsonValue } });
  }

  async listForAccount(accountId: string, limit = 50): Promise<NotificationRecord[]> {
    return this.database.notification.findMany({
      where: { accountId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: Math.min(Math.max(limit, 1), 100),
    });
  }

  async markReadForAccount(id: string, accountId: string): Promise<boolean> {
    const result = await this.database.notification.updateMany({
      where: { id, accountId, readAt: null },
      data: { readAt: new Date() },
    });
    return result.count === 1;
  }
}
