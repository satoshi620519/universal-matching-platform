import { Injectable } from '@nestjs/common';
import { NotificationChannelAdapter, NotificationChannelDispatch } from './notification-channel.js';

@Injectable()
export class NotificationChannelDispatchService {
  constructor(private readonly adapters: readonly NotificationChannelAdapter[]) {}

  async dispatch(input: NotificationChannelDispatch): Promise<void> {
    // Durable notification persistence precedes this boundary. A channel adapter
    // must never become the source of truth for notification existence.
    await Promise.all(this.adapters.map(adapter => adapter.dispatch(input)));
  }
}
