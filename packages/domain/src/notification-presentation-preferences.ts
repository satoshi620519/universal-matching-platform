export const NOTIFICATION_PRESENTATION_KEYS = [
  'match',
  'message',
  'like',
  'system',
] as const;

export type NotificationPresentationKey = typeof NOTIFICATION_PRESENTATION_KEYS[number];

export interface NotificationPresentationEntry {
  readonly key: NotificationPresentationKey;
  readonly enabled: boolean;
}

export interface NotificationPresentationPreferences {
  readonly notifications: readonly NotificationPresentationEntry[];
}

const keys = new Set<string>(NOTIFICATION_PRESENTATION_KEYS);

/** Purchaser-facing presentation defaults only; delivery and user consent remain separate concerns. */
export function validateNotificationPresentationPreferences(
  configuration: NotificationPresentationPreferences,
): void {
  const seen = new Set<string>();
  for (const notification of configuration.notifications) {
    if (!keys.has(notification.key)) throw new Error('notification presentation key is invalid');
    if (seen.has(notification.key)) throw new Error('notification presentation keys must be unique');
    seen.add(notification.key);
  }
}

export function resolveNotificationPresentationPreferences(
  configuration: NotificationPresentationPreferences | undefined,
): readonly NotificationPresentationEntry[] {
  const configured = new Map(configuration?.notifications.map(entry => [entry.key, entry.enabled]) ?? []);
  return NOTIFICATION_PRESENTATION_KEYS.map(key => Object.freeze({ key, enabled: configured.get(key) ?? true }));
}
