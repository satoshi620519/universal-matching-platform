import { describe, expect, it } from 'vitest';
import { summarizeQuickLaunchConfiguration } from './quick-launch-configuration-summary.js';

describe('Quick Launch configuration summary — profile schema', () => {
  it('projects profile field counts, required counts, and stable keys from an immutable snapshot', () => {
    const summary = summarizeQuickLaunchConfiguration({
      version: 7,
      publishedAt: '2026-09-03T00:00:00.000Z',
      snapshot: {
        applicationName: 'Profile Launch',
        primaryColor: '#123456',
        profileSchema: { fields: [
          { key: 'display_name', label: 'Display name', type: 'text', required: true, visibility: 'public' },
          { key: 'interests', label: 'Interests', type: 'select', visibility: 'authenticated', options: ['music', 'travel'] },
        ] },
      },
    });
    expect(summary.profileFieldCount).toBe(2);
    expect(summary.requiredProfileFieldCount).toBe(1);
    expect(summary.profileFieldKeys).toEqual(['display_name', 'interests']);
  });

  it('keeps legacy snapshots compatible when no profile schema exists', () => {
    const summary = summarizeQuickLaunchConfiguration({ version: 1, snapshot: { applicationName: 'Legacy', primaryColor: '#123456' } });
    expect(summary.profileFieldCount).toBeUndefined();
    expect(summary.requiredProfileFieldCount).toBeUndefined();
    expect(summary.profileFieldKeys).toBeUndefined();
  });
});
