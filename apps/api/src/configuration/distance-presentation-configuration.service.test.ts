import { describe, expect, it, vi } from 'vitest';
import type { ConfigurationEffectiveValueService } from './configuration-effective-value.service.js';
import { DistancePresentationConfigurationService } from './distance-presentation-configuration.service.js';

describe('DistancePresentationConfigurationService', () => {
  it('resolves deployment distance units', async () => {
    const values = { resolve: vi.fn().mockResolvedValue(JSON.stringify({ unit: 'imperial' })) };
    const service = new DistancePresentationConfigurationService(values as unknown as ConfigurationEffectiveValueService);
    await expect(service.resolve()).resolves.toEqual({ unit: 'imperial' });
    expect(values.resolve).toHaveBeenCalledWith(expect.objectContaining({ key: 'distance.presentation', allowedScopes: ['deployment'] }));
  });

  it('rejects invalid policy shape', async () => {
    const values = { resolve: vi.fn().mockResolvedValue(JSON.stringify({})) };
    const service = new DistancePresentationConfigurationService(values as unknown as ConfigurationEffectiveValueService);
    await expect(service.resolve()).rejects.toThrow('distance presentation configuration has an invalid shape');
  });
});
