import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service.js';
import {
  EmailOutboxRepository,
  type EmailOutboxMessage,
} from './email-outbox.repository.js';

@Injectable()
export class PrismaEmailOutboxRepository extends EmailOutboxRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async enqueue(input: {
    readonly accountId: string;
    readonly emailAddress: string;
    readonly kind: 'email-verification';
  }): Promise<EmailOutboxMessage> {
    return this.database.emailOutboxMessage.create({
      data: { ...input, status: 'pending' },
    }) as Promise<EmailOutboxMessage>;
  }

  async claimNext(now: Date): Promise<EmailOutboxMessage | null> {
    const staleBefore = new Date(now.getTime() - 5 * 60_000);
    const rows = await this.database.$queryRawUnsafe<any[]>(
      'UPDATE email_outbox_messages ' +
      'SET attempts = attempts + 1, locked_at = $1, updated_at = $1 ' +
      'WHERE id = (SELECT id FROM email_outbox_messages ' +
      'WHERE status = \'pending\' AND available_at <= $1 ' +
      'AND (locked_at IS NULL OR locked_at < $2) ' +
      'ORDER BY available_at ASC, created_at ASC FOR UPDATE SKIP LOCKED LIMIT 1) ' +
      'RETURNING id, account_id AS "accountId", email_address AS "emailAddress", ' +
      'kind, status, attempts, available_at AS "availableAt"',
      now,
      staleBefore,
    );
    return rows[0] ?? null;
  }

  async markDelivered(id: string, deliveredAt: Date): Promise<void> {
    await this.database.emailOutboxMessage.update({
      where: { id },
      data: { status: 'delivered', deliveredAt, lockedAt: null, lastError: null },
    });
  }

  async reschedule(
    id: string,
    input: { readonly availableAt: Date; readonly error: string },
  ): Promise<void> {
    await this.database.emailOutboxMessage.update({
      where: { id },
      data: {
        availableAt: input.availableAt,
        lastError: input.error.slice(0, 500),
        lockedAt: null,
      },
    });
  }
}
