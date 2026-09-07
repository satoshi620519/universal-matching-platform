import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannelDispatchService } from './notification-channel-dispatch.service.js';
import { PrismaNotificationRepository, NotificationRecord } from './prisma-notification.repository.js';

export type CreateNotificationInput = {
  readonly accountId: string;
  readonly kind: string;
  readonly payload: unknown;
};

/**
 * Single application boundary for durable notification creation.
 *
 * Persistence remains authoritative: dispatch happens only after a notification
 * exists durably. Channel adapters are therefore replaceable delivery mechanisms,
 * not alternate sources of notification truth.
 */
@Injectable()
export class NotificationCreationService {
  private readonly logger = new Logger(NotificationCreationService.name);

  constructor(
    private readonly notifications: PrismaNotificationRepository,
    private readonly dispatch: NotificationChannelDispatchService,
  ) {}

  async create(input: CreateNotificationInput): Promise<NotificationRecord> {
    const notification = await this.notifications.create(input);

    try {
      await this.dispatch.dispatch({
        notificationId: notification.id,
        accountId: notification.accountId,
        kind: notification.kind,
        payload: notification.payload,
      });
    } catch (error) {
      // Delivery is a secondary concern. The notification is already durable and
      // remains available through the in-app read model even when a channel fails.
      // Future retry infrastructure can consume this failure boundary without
      // changing notification creation semantics.
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Notification ${notification.id} was persisted but channel dispatch failed: ${message}`,
      );
    }

    return notification;
  }
}
