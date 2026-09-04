import { describe, expect, it, vi } from 'vitest';
import { MatchingRulesConfigurationService } from './matching-rules-configuration.service.js';

describe('MatchingRulesConfigurationService', () => {
  it('returns published purchaser rules and never fabricates defaults', async () => {
    const quickLaunch = { findPublished: vi.fn().mockResolvedValue({ published: { matchingRules: { rules: [{ key:'role', targetField:'role', operator:'equals', value:'designer', enabled:true }] } } }) };
    await expect(new MatchingRulesConfigurationService(quickLaunch as any).resolve()).resolves.toEqual(quickLaunch.findPublished.mock.results[0] ? { rules: [{ key:'role', targetField:'role', operator:'equals', value:'designer', enabled:true }] } : undefined);
  });

  it('returns undefined when no published matching rules exist', async () => {
    const quickLaunch = { findPublished: vi.fn().mockResolvedValue(undefined) };
    await expect(new MatchingRulesConfigurationService(quickLaunch as any).resolve()).resolves.toBeUndefined();
  });
});
