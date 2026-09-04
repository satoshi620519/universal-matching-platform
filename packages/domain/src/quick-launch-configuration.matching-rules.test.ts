import { describe, expect, it } from 'vitest';
import { publishQuickLaunchConfiguration, validateQuickLaunchDraft } from './quick-launch-configuration.js';

const base = {
  applicationName: 'Launch', primaryColor: '#123456', supportedCountries: ['JP'],
  categories: [{ key: 'dating', displayName: 'Dating' }], enabledFeatures: ['matching'],
  onboarding: [{ field: 'displayName', required: true }],
} as const;

describe('Quick Launch matching rules', () => {
  it('publishes normalized immutable typed matching rule metadata', () => {
    const published = publishQuickLaunchConfiguration({ ...base, matchingRules: { rules: [
      { key: ' distance ', targetField: ' distanceKm ', operator: 'withinDistance', value: 25, enabled: true, weight: 0.5 },
      { key: 'verified', targetField: 'verified', operator: 'equals', value: true, enabled: false },
    ] } }, 4, '2026-09-04T00:00:00.000Z');
    expect(published.matchingRules?.rules).toEqual([
      { key: 'distance', targetField: 'distanceKm', operator: 'withinDistance', value: 25, enabled: true, weight: 0.5 },
      { key: 'verified', targetField: 'verified', operator: 'equals', value: true, enabled: false },
    ]);
    expect(Object.isFrozen(published.matchingRules)).toBe(true);
    expect(Object.isFrozen(published.matchingRules?.rules)).toBe(true);
    expect(Object.isFrozen(published.matchingRules?.rules[0])).toBe(true);
  });

  it('rejects duplicate keys, invalid weights, and non-finite numeric values', () => {
    expect(() => validateQuickLaunchDraft({ ...base, matchingRules: { rules: [
      { key: 'x', targetField: 'a', operator: 'equals', value: 'a', enabled: true },
      { key: ' x ', targetField: 'b', operator: 'equals', value: 'b', enabled: true },
    ] } })).toThrow('unique');
    expect(() => validateQuickLaunchDraft({ ...base, matchingRules: { rules: [
      { key: 'x', targetField: 'a', operator: 'equals', value: Number.NaN, enabled: true },
    ] } })).toThrow('finite');
    expect(() => validateQuickLaunchDraft({ ...base, matchingRules: { rules: [
      { key: 'x', targetField: 'a', operator: 'equals', value: 'a', enabled: true, weight: -1 },
    ] } })).toThrow('weight');
  });

  it('keeps older snapshots compatible when matching rule metadata is absent', () => {
    const published = publishQuickLaunchConfiguration(base, 5, '2026-09-04T00:00:00.000Z');
    expect(published.matchingRules).toBeUndefined();
  });
});
