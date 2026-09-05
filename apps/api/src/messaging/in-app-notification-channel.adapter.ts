import { Injectable } from '@nestjs/common';
import { NotificationChannel, NotificationChannelAdapter, NotificationChannelDispatch } from './notification-channel.js';
import { NotificationRealtimePublicationService } from './notification-realtime-publication.service.js';

@Injectable()
export class InAppNotificationChannelAdapter extends NotificationChannelAdapter {
  readonly channel: NotificationChannel = 'in_app';

  constructor(private readonly realtime: NotificationRealtimePublicationService) {
    super();
  }

  async dispatch(input: NotificationChannelDispatch): Promise<void> {
    await this.realtime.publishCreated({
      notificationIds: [input.notificationId],
      recipientAccountIds: [input.accountId],
    });
  }
}
