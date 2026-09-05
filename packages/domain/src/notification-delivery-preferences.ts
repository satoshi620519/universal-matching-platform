export const NOTIFICATION_DELIVERY_CATEGORIES = [
  'match',
  'message',
  'account_security',
  'moderation',
] as const;

export const NOTIFICATION_DELIVERY_CHANNELS = [
  'in_app',
  'email',
  'push',
] as const;

export type NotificationDeliveryCategory = typeof NOTIFICATION_DELIVERY_CATEGORIES[number];
export type NotificationDeliveryChannel = typeof NOTIFICATION_DELIVERY_CHANNELS[number];

export interface NotificationDeliveryPreference {
  readonly category: NotificationDeliveryCategory;
  readonly channel: NotificationDeliveryChannel;
  readonly enabled: boolean;
}

export interface NotificationDeliveryPreferences {
  readonly preferences: readonly NotificationDeliveryPreference[];
}

const categories = new Set<string>(NOTIFICATION_DELIVERY_CATEGORIES);
const channels = new Set<string>(NOTIFICATION_DELIVERY_CHANNELS);

export function validateNotificationDeliveryPreferences(configuration: NotificationDeliveryPreferences): void {
  const seen = new Set<string>();
  for (const preference of configuration.preferences) {
    if (!categories.has(preference.category)) throw new Error('notification delivery category is invalid');
    if (!channels.has(preference.channel)) throw new Error('notification delivery channel is invalid');
    const key = preference.category + ':' + preference.channel;
    if (seen.has(key)) throw new Error('notification delivery preferences must be unique');
    seen.add(key);
  }
}

export function resolveNotificationDeliveryEnabled(
  configuration: NotificationDeliveryPreferences | undefined,
  category: NotificationDeliveryCategory,
  channel: NotificationDeliveryChannel,
): boolean {
  validateNotificationDeliveryPreferences(configuration ?? { preferences: [] });
  return configuration?.preferences.find(entry => entry.category === category && entry.channel === channel)?.enabled ?? (channel === 'in_app');
}
