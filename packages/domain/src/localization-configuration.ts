export interface LocalizationConfiguration {
  readonly defaultLocale: string;
  readonly supportedLocales: readonly string[];
  readonly supportedCountries: readonly string[];
  readonly defaultTimezone?: string;
  readonly countryLocales?: Readonly<Record<string, string>>;
}

function normalizeLocale(locale: string): string {
  const normalized = locale.trim();
  if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(normalized)) throw new Error('locale must use language or language-REGION format');
  return normalized;
}

function normalizeCountry(country: string): string {
  const normalized = country.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) throw new Error('country must be an ISO 3166-1 alpha-2 code');
  return normalized;
}

export function defaultLocalizationConfiguration(input: Pick<LocalizationConfiguration, 'supportedCountries'>): LocalizationConfiguration {
  const countries = input.supportedCountries.map(normalizeCountry);
  return Object.freeze({
    defaultLocale: 'en',
    supportedLocales: Object.freeze(['en']),
    supportedCountries: Object.freeze([...countries]),
  });
}

export function validateLocalizationConfiguration(configuration: LocalizationConfiguration): void {
  const locales = configuration.supportedLocales.map(normalizeLocale);
  if (!locales.length) throw new Error('at least one supported locale is required');
  const countries = configuration.supportedCountries.map(normalizeCountry);
  if (!countries.length) throw new Error('at least one supported country is required');
  if (new Set(locales).size !== locales.length) throw new Error('supportedLocales must be unique');
  if (new Set(countries).size !== countries.length) throw new Error('supportedCountries must be unique');
  const defaultLocale = normalizeLocale(configuration.defaultLocale);
  if (!locales.includes(defaultLocale)) throw new Error('defaultLocale must be included in supportedLocales');
  for (const [country, locale] of Object.entries(configuration.countryLocales ?? {})) {
    normalizeCountry(country);
    const normalizedLocale = normalizeLocale(locale);
    if (!countries.includes(country.toUpperCase())) throw new Error('countryLocales may only reference supportedCountries');
    if (!locales.includes(normalizedLocale)) throw new Error('countryLocales may only reference supportedLocales');
  }
}
