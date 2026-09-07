import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannelAdapter, NotificationChannelDispatch } from './notification-channel.js';

export type NotificationChannelDispatchResult = {
  readonly channel: string;
  readonly delivered: boolean;
  readonly error?: unknown;
};

@Injectable()
export class NotificationChannelDispatchService {
  private readonly logger = new Logger(NotificationChannelDispatchService.name);

  constructor(private readonly adapter: NotificationChannelAdapter) {}

  /**
   * Attempts delivery without changing the durable notification's existence.
   * Failures are reported to the caller so policy (logging/retry) can remain at
   * the application boundary rather than inside channel adapters.
   */
  async dispatch(
    input: NotificationChannelDispatch,
  ): Promise<NotificationChannelDispatchResult> {
    try {
      await this.adapter.dispatch(input);
      return {
        channel: this.adapter.channel,
        delivered: true,
      };
    } catch (error) {
      this.logger.warn(
        `Notification ${input.notificationId} delivery failed on channel ${this.adapter.channel}`,
      );
      return {
        channel: this.adapter.channel,
        delivered: false,
        error,
      };
    }
  }
}
