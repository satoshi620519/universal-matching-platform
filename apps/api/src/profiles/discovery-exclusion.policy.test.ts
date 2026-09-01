import { describe, expect, it } from 'vitest';
import { AllowAllDiscoveryExclusionPolicy } from './discovery-exclusion.policy.js';

describe('Discovery exclusion policy baseline', () => {
  it('is explicit and non-excluding by default', async () => {
    await expect(new AllowAllDiscoveryExclusionPolicy().excludes('a', 'b')).resolves.toBe(false);
  });
});
