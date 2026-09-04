import { describe, expect, it } from 'vitest';
import { publishQuickLaunchConfiguration, validateQuickLaunchDraft } from './quick-launch-configuration.js';

const base = {
  applicationName: 'Launch', primaryColor: '#123456', supportedCountries: ['JP'],
  categories: [{ key: 'dating', displayName: 'Dating' }], enabledFeatures: ['matching'],
  onboarding: [{ field: 'displayName', required: true }],
} as const;

describe('Quick Launch category metadata', () => {
  it('publishes normalized immutable optional metadata', () => {
    const published = publishQuickLaunchConfiguration({ ...base, categories: [{ key: ' hobby ', displayName: ' Hobby ', description: '  Find people by shared interests. ', enabled: false }] }, 1, '2026-09-04T00:00:00.000Z');
    expect(published.categories).toEqual([{ key: 'hobby', displayName: 'Hobby', description: 'Find people by shared interests.', enabled: false }]);
    expect(Object.isFrozen(published.categories)).toBe(true);
    expect(Object.isFrozen(published.categories[0])).toBe(true);
  });

  it('rejects blank or duplicate purchaser-facing labels', () => {
    expect(() => validateQuickLaunchDraft({ ...base, categories: [{ key: 'a', displayName: ' ' }] })).toThrow('displayName');
    expect(() => validateQuickLaunchDraft({ ...base, categories: [{ key: 'a', displayName: 'Dating' }, { key: 'b', displayName: ' Dating ' }] })).toThrow('displayNames');
  });

  it('keeps legacy categories compatible without optional metadata', () => {
    const published = publishQuickLaunchConfiguration(base, 2, '2026-09-04T00:00:00.000Z');
    expect(published.categories).toEqual([{ key: 'dating', displayName: 'Dating' }]);
  });
});
