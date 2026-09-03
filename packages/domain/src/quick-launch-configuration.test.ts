import { describe, expect, it } from 'vitest';
import { publishQuickLaunchConfiguration, validateQuickLaunchDraft } from './quick-launch-configuration.js';

const draft = {
  applicationName: 'My Matching',
  primaryColor: '#123456',
  supportedCountries: ['JP'],
  categories: [{ key: 'dating', displayName: 'Dating' }],
  enabledFeatures: ['matching', 'chat'],
  onboarding: [{ field: 'displayName', required: true }],
} as const;

describe('Quick Launch configuration', () => {
  it('publishes a validated immutable versioned snapshot', () => {
    const published = publishQuickLaunchConfiguration(draft, 1, '2026-09-03T00:00:00.000Z');
    expect(published.version).toBe(1);
    expect(published.publishedAt).toBe('2026-09-03T00:00:00.000Z');
    expect(published).toMatchObject({ applicationName: 'My Matching', supportedCountries: ['JP'] });
    expect(Object.isFrozen(published)).toBe(true);
  });

  it('rejects incomplete or ambiguous launch settings', () => {
    expect(() => validateQuickLaunchDraft({ ...draft, applicationName: ' ' })).toThrow('applicationName');
    expect(() => validateQuickLaunchDraft({ ...draft, supportedCountries: [] })).toThrow('country');
    expect(() => validateQuickLaunchDraft({ ...draft, categories: [] })).toThrow('category');
    expect(() => validateQuickLaunchDraft({ ...draft, primaryColor: 'blue' })).toThrow('primaryColor');
  });
});
