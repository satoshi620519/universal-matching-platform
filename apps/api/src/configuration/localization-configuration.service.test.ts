import { describe, expect, it, vi } from 'vitest';
import { LocalizationConfigurationService } from './localization-configuration.service.js';

describe('LocalizationConfigurationService', () => {
  it('resolves and validates the published deployment configuration', async () => {
    const values = {
      resolve: vi.fn().mockResolvedValue(JSON.stringify({
        defaultLocale: 'ja',
        supportedLocales: ['ja', 'en'],
        supportedCountries: ['JP', 'US'],
        defaultTimezone: 'Asia/Tokyo',
        countryLocales: { JP: 'ja', US: 'en' },
      })),
    };
    const service = new LocalizationConfigurationService(values);

    await expect(service.resolve()).resolves.toMatchObject({
      defaultLocale: 'ja',
      supportedLocales: ['ja', 'en'],
      supportedCountries: ['JP', 'US'],
      defaultTimezone: 'Asia/Tokyo',
    });
    expect(values.resolve).toHaveBeenCalledWith(expect.objectContaining({
      key: 'localization.configuration',
      allowedScopes: ['deployment'],
    }));
  });

  it('rejects malformed published JSON', async () => {
    const service = new LocalizationConfigurationService({
      resolve: vi.fn().mockResolvedValue('{invalid'),
    });

    await expect(service.resolve()).rejects.toThrow('localization configuration must be valid JSON');
  });

  it('rejects invalid localization configuration values', async () => {
    const service = new LocalizationConfigurationService({
      resolve: vi.fn().mockResolvedValue(JSON.stringify({
        defaultLocale: 'ja',
        supportedLocales: ['en'],
        supportedCountries: ['JP'],
      })),
    });

    await expect(service.resolve()).rejects.toThrow('defaultLocale must be included in supportedLocales');
  });
});
