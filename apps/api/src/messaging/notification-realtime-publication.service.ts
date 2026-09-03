import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RealtimePublisher } from '../realtime/realtime-publisher.js';

@Injectable()
export class NotificationRealtimePublicationService {
  constructor(private readonly realtime: RealtimePublisher) {}

  async publishCreated(input: { notificationIds: string[]; recipientAccountIds: string[] }): Promise<void> {
    if (input.notificationIds.length !== input.recipientAccountIds.length) throw new Error('Notification publication recipients must align with notification ids');
    await Promise.all(input.notificationIds.map((notificationId, index) =>
      this.realtime.publishToAccount(input.recipientAccountIds[index], {
        eventId: randomUUID(),
        eventType: 'notification.created',
        schemaVersion: 1,
        occurredAt: new Date().toISOString(),
        resource: { type: 'notification', id: notificationId },
        payload: { notificationId },
      }),
    ));
  }
}
