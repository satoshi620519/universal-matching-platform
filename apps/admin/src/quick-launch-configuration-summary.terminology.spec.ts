import { describe, expect, it } from 'vitest';
import { summarizeQuickLaunchConfiguration } from './quick-launch-configuration-summary.js';

describe('terminology snapshot summary', () => {
  it('trims non-empty custom terminology', () => {
    const summary = summarizeQuickLaunchConfiguration({ snapshot: { terminology: { terms: { user: ' Member ', match: 'Connection', message: '   ' } } } });
    expect(summary.terminologyCount).toBe(2);
    expect(summary.terminology).toEqual({ user: 'Member', match: 'Connection' });
  });

  it('keeps terminology metadata absent for legacy snapshots', () => {
    const summary = summarizeQuickLaunchConfiguration({ snapshot: {} });
    expect(summary.terminologyCount).toBeUndefined();
    expect(summary.terminology).toBeUndefined();
  });
});
