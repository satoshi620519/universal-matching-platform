import { describe, expect, it } from 'vitest';
import { publishQuickLaunchConfiguration, validateQuickLaunchDraft } from './quick-launch-configuration.js';

const base = {
  applicationName: 'Launch', primaryColor: '#123456', supportedCountries: ['JP'],
  categories: [{ key: 'dating', displayName: 'Dating' }], enabledFeatures: ['matching'],
  onboarding: [{ field: 'displayName', required: true }],
} as const;

describe('Quick Launch notification presentation preferences', () => {
  it('normalizes configured defaults into a complete immutable presentation set', () => {
    const published = publishQuickLaunchConfiguration({ ...base, notificationPresentation: { notifications: [
      { key: 'match', enabled: false }, { key: 'message', enabled: true },
    ] } }, 1, '2026-09-04T00:00:00.000Z');
    expect(published.notificationPresentation?.notifications).toEqual([
      { key: 'match', enabled: false }, { key: 'message', enabled: true },
      { key: 'like', enabled: true }, { key: 'system', enabled: true },
    ]);
    expect(Object.isFrozen(published.notificationPresentation)).toBe(true);
    expect(Object.isFrozen(published.notificationPresentation?.notifications)).toBe(true);
    expect(Object.isFrozen(published.notificationPresentation?.notifications[0])).toBe(true);
  });

  it('rejects duplicate presentation keys', () => {
    expect(() => validateQuickLaunchDraft({ ...base, notificationPresentation: { notifications: [
      { key: 'match', enabled: true }, { key: 'match', enabled: false },
    ] } })).toThrow('unique');
  });

  it('keeps legacy snapshots compatible when preferences are absent', () => {
    const published = publishQuickLaunchConfiguration(base, 2, '2026-09-04T00:00:00.000Z');
    expect(published.notificationPresentation).toBeUndefined();
  });
});
