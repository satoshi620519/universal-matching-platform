import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service.js';
import {
  FailedEmailOutboxRepository,
  type FailedEmailOutboxMessage,
} from './failed-email-outbox.repository.js';

@Injectable()
export class PrismaFailedEmailOutboxRepository extends FailedEmailOutboxRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async listFailed(input: {
    readonly limit: number;
    readonly before?: Date;
  }): Promise<readonly FailedEmailOutboxMessage[]> {
    const where = {
      status: 'failed',
      ...(input.before ? { failedAt: { lt: input.before } } : {}),
    };

    return this.database.emailOutboxMessage.findMany({
      where,
      orderBy: [{ failedAt: 'desc' }, { id: 'desc' }],
      take: input.limit,
      select: {
        id: true,
        accountId: true,
        emailAddress: true,
        kind: true,
        attempts: true,
        failedAt: true,
        lastError: true,
      },
    }).then((rows) => rows.map((row) => ({
      ...row,
      kind: row.kind as 'email-verification',
      failedAt: row.failedAt as Date,
    })));
  }

  async requeueFailed(
    id: string,
    input: { readonly availableAt: Date },
  ): Promise<boolean> {
    const result = await this.database.emailOutboxMessage.updateMany({
      where: { id, status: 'failed' },
      data: {
        status: 'pending',
        availableAt: input.availableAt,
        failedAt: null,
        lockedAt: null,
        lastError: null,
      },
    });
    return result.count === 1;
  }
}
