import { describe, expect, it, vi } from 'vitest';
import { LocalizationConfigurationService } from './localization-configuration.service.js';

describe('LocalizationConfigurationService', () => {
  const values = () => ({ resolve: vi.fn() });

  it('resolves and validates the published deployment configuration', async () => {
    const dependency = values();
    dependency.resolve.mockResolvedValue(JSON.stringify({
      defaultLocale: 'ja',
      supportedLocales: ['ja', 'en'],
      supportedCountries: ['JP', 'US'],
      defaultTimezone: 'Asia/Tokyo',
      countryLocales: { JP: 'ja', US: 'en' },
    }));
    const service = new LocalizationConfigurationService(dependency as never);

    await expect(service.resolve()).resolves.toMatchObject({
      defaultLocale: 'ja',
      supportedLocales: ['ja', 'en'],
      supportedCountries: ['JP', 'US'],
      defaultTimezone: 'Asia/Tokyo',
    });
    expect(dependency.resolve).toHaveBeenCalledWith(expect.objectContaining({
      key: 'localization.configuration',
      allowedScopes: ['deployment'],
    }));
  });

  it('rejects malformed published JSON', async () => {
    const dependency = values();
    dependency.resolve.mockResolvedValue('{invalid');
    const service = new LocalizationConfigurationService(dependency as never);

    await expect(service.resolve()).rejects.toThrow('localization configuration must be valid JSON');
  });

  it('rejects invalid localization configuration values', async () => {
    const dependency = values();
    dependency.resolve.mockResolvedValue(JSON.stringify({
      defaultLocale: 'ja',
      supportedLocales: ['en'],
      supportedCountries: ['JP'],
    }));
    const service = new LocalizationConfigurationService(dependency as never);

    await expect(service.resolve()).rejects.toThrow('defaultLocale must be included in supportedLocales');
  });
});
