import { describe, expect, it } from 'vitest';
import { publishQuickLaunchConfiguration } from './quick-launch-configuration.js';

describe('QuickLaunch terminology publication', () => {
  const draft = {
    applicationName: 'Example', primaryColor: '#123456', supportedCountries: ['JP'],
    categories: [{ key: 'networking', displayName: 'Networking' }], enabledFeatures: [], onboarding: [],
  } as const;
  it('publishes normalized purchaser terminology without changing stable keys', () => {
    const terminology = { terms: { user: '  Member ', match: '   ' } } as const;
    const published = publishQuickLaunchConfiguration({ ...draft, terminology }, 1, '2026-01-01T00:00:00.000Z');
    expect(published.terminology).toEqual({ terms: { user: 'Member' } });
    expect(Object.isFrozen(published.terminology)).toBe(true);
  });
});
