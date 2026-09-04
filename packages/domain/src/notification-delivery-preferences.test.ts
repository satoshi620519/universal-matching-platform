import { describe, expect, it } from 'vitest';
import {
  resolveNotificationDeliveryEnabled,
  validateNotificationDeliveryPreferences,
} from './notification-delivery-preferences.js';

describe('notification delivery preferences', () => {
  it('defaults only in-app delivery to enabled', () => {
    expect(resolveNotificationDeliveryEnabled(undefined, 'message', 'in_app')).toBe(true);
    expect(resolveNotificationDeliveryEnabled(undefined, 'message', 'email')).toBe(false);
    expect(resolveNotificationDeliveryEnabled(undefined, 'message', 'push')).toBe(false);
  });

  it('allows explicit category/channel overrides', () => {
    expect(resolveNotificationDeliveryEnabled({
      preferences: [{ category: 'moderation', channel: 'email', enabled: true }],
    }, 'moderation', 'email')).toBe(true);
  });

  it('rejects duplicate policy entries', () => {
    expect(() => validateNotificationDeliveryPreferences({
      preferences: [
        { category: 'match', channel: 'in_app', enabled: true },
        { category: 'match', channel: 'in_app', enabled: false },
      ],
    })).toThrow('unique');
  });
});
