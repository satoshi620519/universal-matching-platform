import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service.js';
import { PaymentWebhookIdempotencyStore } from './payment-webhook.js';

@Injectable()
export class PrismaPaymentWebhookIdempotencyStore extends PaymentWebhookIdempotencyStore {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async claim(eventId: string): Promise<boolean> {
    const rows = await this.database.$queryRaw<{ claimed: boolean }[]>(
      Prisma.sql`INSERT INTO payment_webhook_idempotency (event_id) VALUES (${eventId}) ON CONFLICT (event_id) DO NOTHING RETURNING TRUE AS claimed`,
    );
    return rows.length === 1;
  }
}
