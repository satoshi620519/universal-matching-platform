export type NotificationChannel = 'in_app' | 'email' | 'push';

export type NotificationChannelDispatch = {
  readonly notificationId: string;
  readonly accountId: string;
  readonly kind: string;
  readonly payload: unknown;
};

export abstract class NotificationChannelAdapter {
  abstract readonly channel: NotificationChannel;
  abstract dispatch(input: NotificationChannelDispatch): Promise<void>;
}
