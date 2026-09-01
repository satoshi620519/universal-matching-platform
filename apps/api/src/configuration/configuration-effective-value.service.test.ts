import { describe, expect, it, vi } from 'vitest';
import { ConfigurationEffectiveValueService } from './configuration-effective-value.service.js';

describe('ConfigurationEffectiveValueService', () => {
  const definition = {
    key: 'matching.radius',
    defaultValue: 10,
    allowedScopes: ['platform', 'deployment', 'region'] as const,
  };

  it('delegates precedence to the central domain resolver', async () => {
    const findPublishedValues = vi.fn().mockResolvedValue([
      { settingKey: definition.key, scope: 'platform', value: 20 },
      { settingKey: definition.key, scope: 'region', value: 5 },
    ]);
    const service = new ConfigurationEffectiveValueService({ findPublishedValues } as any);

    await expect(service.resolve(definition)).resolves.toBe(5);
    expect(findPublishedValues).toHaveBeenCalledWith(definition.key);
  });

  it('uses the domain default when no published value exists', async () => {
    const service = new ConfigurationEffectiveValueService({
      findPublishedValues: vi.fn().mockResolvedValue([]),
    } as any);

    await expect(service.resolve(definition)).resolves.toBe(10);
  });
});
