import { describe, expect, it } from 'vitest';
import { summarizeQuickLaunchConfiguration } from './quick-launch-configuration-summary.js';

describe('quick launch terminology snapshot summary', () => {
  it('summarizes non-empty terminology labels from an immutable snapshot', () => {
    const summary = summarizeQuickLaunchConfiguration({
      snapshot: { applicationName: 'Network', terminology: { terms: { match: 'Connection', matches: 'Connections', user: '   ' } } },
    });
    expect(summary.terminologyCount).toBe(2);
    expect(summary.terminology).toEqual({ match: 'Connection', matches: 'Connections' });
  });

  it('keeps terminology absent for older snapshots', () => {
    const summary = summarizeQuickLaunchConfiguration({ snapshot: { applicationName: 'Legacy' } });
    expect(summary.terminologyCount).toBeUndefined();
    expect(summary.terminology).toBeUndefined();
  });
});
