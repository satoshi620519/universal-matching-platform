import { Injectable } from '@nestjs/common';
import {
  defaultLocalizationConfiguration,
  validateLocalizationConfiguration,
  type LocalizationConfiguration,
} from '@universal/domain';
import { ConfigurationEffectiveValueService } from './configuration-effective-value.service.js';

const SETTING_KEY = 'localization.configuration';
const DEFAULT_COUNTRIES = ['US'];
const DEFAULT_CONFIGURATION = defaultLocalizationConfiguration({ supportedCountries: DEFAULT_COUNTRIES });

@Injectable()
export class LocalizationConfigurationService {
  constructor(private readonly values: ConfigurationEffectiveValueService) {}

  async resolve(): Promise<LocalizationConfiguration> {
    const serialized = await this.values.resolve<string>({
      key: SETTING_KEY,
      defaultValue: JSON.stringify(DEFAULT_CONFIGURATION),
      allowedScopes: ['deployment'],
    });

    let configuration: unknown;
    try {
      configuration = JSON.parse(serialized);
    } catch {
      throw new Error('localization configuration must be valid JSON');
    }

    if (!isLocalizationConfiguration(configuration)) {
      throw new Error('localization configuration has an invalid shape');
    }

    validateLocalizationConfiguration(configuration);
    return configuration;
  }
}

function isLocalizationConfiguration(value: unknown): value is LocalizationConfiguration {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.defaultLocale === 'string' &&
    Array.isArray(candidate.supportedLocales) &&
    candidate.supportedLocales.every((locale) => typeof locale === 'string') &&
    Array.isArray(candidate.supportedCountries) &&
    candidate.supportedCountries.every((country) => typeof country === 'string') &&
    (candidate.defaultTimezone === undefined || typeof candidate.defaultTimezone === 'string') &&
    (candidate.countryLocales === undefined || isCountryLocales(candidate.countryLocales))
  );
}

function isCountryLocales(value: unknown): value is Record<string, string> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  return Object.values(value).every((locale) => typeof locale === 'string');
}
