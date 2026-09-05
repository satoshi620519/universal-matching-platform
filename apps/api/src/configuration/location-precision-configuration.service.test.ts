import { describe, expect, it, vi } from 'vitest';
import type { ConfigurationEffectiveValueService } from './configuration-effective-value.service.js';
import { LocationPrecisionConfigurationService } from './location-precision-configuration.service.js';

describe('LocationPrecisionConfigurationService', () => {
  const dependency = (): Pick<ConfigurationEffectiveValueService, 'resolve'> => ({ resolve: vi.fn() });

  it('resolves a validated deployment policy', async () => {
    const values = dependency();
    vi.mocked(values.resolve).mockResolvedValue(JSON.stringify({ publicPrecision: 'region' }));
    const service = new LocationPrecisionConfigurationService(values as ConfigurationEffectiveValueService);

    await expect(service.resolve()).resolves.toEqual({ publicPrecision: 'region' });
    expect(values.resolve).toHaveBeenCalledWith(expect.objectContaining({
      key: 'location.precision',
      allowedScopes: ['deployment'],
    }));
  });

  it('rejects malformed JSON', async () => {
    const values = dependency();
    vi.mocked(values.resolve).mockResolvedValue('{invalid');
    const service = new LocationPrecisionConfigurationService(values as ConfigurationEffectiveValueService);

    await expect(service.resolve()).rejects.toThrow('location precision configuration must be valid JSON');
  });

  it('rejects unsupported precision values', async () => {
    const values = dependency();
    vi.mocked(values.resolve).mockResolvedValue(JSON.stringify({ publicPrecision: 'street' }));
    const service = new LocationPrecisionConfigurationService(values as ConfigurationEffectiveValueService);

    await expect(service.resolve()).rejects.toThrow('publicPrecision must be one of none, country, region, city');
  });
});
