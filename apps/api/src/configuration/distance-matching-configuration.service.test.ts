import { describe, expect, it, vi } from 'vitest';
import type { ConfigurationEffectiveValueService } from './configuration-effective-value.service.js';
import { DistanceMatchingConfigurationService } from './distance-matching-configuration.service.js';

describe('DistanceMatchingConfigurationService', () => {
  it('defaults distance matching to disabled', async () => {
    const values = { resolve: vi.fn().mockResolvedValue(false) };
    const service = new DistanceMatchingConfigurationService(values as unknown as ConfigurationEffectiveValueService);
    await expect(service.isEnabled()).resolves.toBe(false);
    expect(values.resolve).toHaveBeenCalledWith({
      key: 'distance.matching.enabled',
      defaultValue: false,
      allowedScopes: ['deployment'],
    });
  });

  it('rejects non-boolean effective values', async () => {
    const values = { resolve: vi.fn().mockResolvedValue('true') };
    const service = new DistanceMatchingConfigurationService(values as unknown as ConfigurationEffectiveValueService);
    await expect(service.isEnabled()).rejects.toThrow('distance matching enabled configuration must be boolean');
  });
});
