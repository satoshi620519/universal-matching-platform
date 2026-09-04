import { describe, expect, it } from 'vitest';
import { validateLocalizationConfiguration } from './localization-configuration.js';

describe('LocalizationConfiguration', () => {
  it('accepts an international deployment contract', () => {
    expect(() => validateLocalizationConfiguration({
      defaultLocale: 'en',
      supportedLocales: ['en', 'ja-JP'],
      supportedCountries: ['US', 'JP'],
      defaultTimezone: 'Asia/Tokyo',
      countryLocales: { JP: 'ja-JP', US: 'en' },
    })).not.toThrow();
  });
  it('rejects invalid deployment boundaries', () => {
    expect(() => validateLocalizationConfiguration({ defaultLocale: 'fr', supportedLocales: ['en'], supportedCountries: ['JP'] })).toThrow('defaultLocale');
    expect(() => validateLocalizationConfiguration({ defaultLocale: 'en', supportedLocales: ['en'], supportedCountries: ['Japan'] })).toThrow('country');
    expect(() => validateLocalizationConfiguration({ defaultLocale: 'en', supportedLocales: ['en'], supportedCountries: ['JP'], defaultTimezone: 'Not/A-Timezone' })).toThrow('timezone');
  });
});
