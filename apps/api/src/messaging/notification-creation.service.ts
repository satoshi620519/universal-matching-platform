import { Injectable } from '@nestjs/common';
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
  constructor(
    private readonly notifications: PrismaNotificationRepository,
    private readonly dispatch: NotificationChannelDispatchService,
  ) {}

  async create(input: CreateNotificationInput): Promise<NotificationRecord> {
    const notification = await this.notifications.create(input);
    await this.dispatch.dispatch({
      notificationId: notification.id,
      accountId: notification.accountId,
      kind: notification.kind,
      payload: notification.payload,
    });
    return notification;
  }
}
