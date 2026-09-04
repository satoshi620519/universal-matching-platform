import { validateBrandingThemeConfiguration, type BrandingThemeConfiguration } from './branding-theme-configuration.js';
import { validateLocalizationConfiguration, type LocalizationConfiguration } from './localization-configuration.js';
import { validateProfileSchemaConfiguration, type ProfileSchemaConfiguration } from './profile-schema-configuration.js';
import { validateFeatureVisibilityConfiguration, type FeatureVisibilityConfiguration } from './feature-visibility-configuration.js';
import { validateMatchingRulesConfiguration, type MatchingRulesConfiguration } from './matching-rules-configuration.js';

export interface QuickLaunchDraft {
  readonly applicationName: string;
  readonly logoUrl?: string;
  readonly primaryColor: string;
  /** Optional richer branding/theme extension; legacy primaryColor/logoUrl remain supported. */
  readonly brandingTheme?: BrandingThemeConfiguration;
  /** Localization extends the existing supportedCountries source of truth. */
  readonly localization?: Omit<LocalizationConfiguration, 'supportedCountries'>;
  /** Defines allowed profile fields; Profile.fields remains the value owner. */
  readonly profileSchema?: ProfileSchemaConfiguration;
  /** Purchaser presentation visibility only; runtime authorization remains independent. */
  readonly featureVisibility?: FeatureVisibilityConfiguration;
  /** Public legal/support destinations; protected operational policies remain independent. */
  readonly legalSupport?: { readonly privacyPolicyUrl?: string; readonly termsOfServiceUrl?: string; readonly supportUrl?: string; readonly supportEmail?: string };
  /** Optional purchaser matching metadata; runtime interpretation remains matching-engine-owned. */
  readonly matchingRules?: MatchingRulesConfiguration;
  readonly supportedCountries: readonly string[];
  readonly categories: readonly { readonly key: string; readonly displayName: string }[];
  readonly enabledFeatures: readonly string[];
  readonly onboarding: readonly { readonly field: string; readonly required: boolean }[];
}

export interface PublishedQuickLaunchConfiguration extends QuickLaunchDraft {
  readonly version: number;
  readonly publishedAt: string;
}

/**
 * Validates the purchaser-facing minimum launch configuration before publication.
 * Publication is immutable: later changes create a new version rather than mutate history.
 */
export function validateQuickLaunchDraft(draft: QuickLaunchDraft): void {
  if (!draft.applicationName.trim()) throw new Error('applicationName must not be empty');
  if (!/^#[0-9A-Fa-f]{6}$/.test(draft.primaryColor)) throw new Error('primaryColor must be a #RRGGBB value');
  if (draft.brandingTheme) validateBrandingThemeConfiguration(draft.brandingTheme);
  if (draft.localization) validateLocalizationConfiguration({ ...draft.localization, supportedCountries: draft.supportedCountries });
  if (draft.profileSchema) validateProfileSchemaConfiguration(draft.profileSchema);
  if (draft.featureVisibility) validateFeatureVisibilityConfiguration(draft.featureVisibility);
  if (draft.matchingRules) validateMatchingRulesConfiguration(draft.matchingRules);
  if (draft.legalSupport) {
    const normalized = (value?: string) => value?.trim() || undefined;
    const urls = [normalized(draft.legalSupport.privacyPolicyUrl), normalized(draft.legalSupport.termsOfServiceUrl), normalized(draft.legalSupport.supportUrl)].filter((value): value is string => Boolean(value));
    for (const value of urls) { let parsed: URL; try { parsed = new URL(value); } catch { throw new Error('legalSupport URL must be valid'); } if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error('legalSupport URL must use http or https'); }
    const email = normalized(draft.legalSupport.supportEmail);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('legalSupport supportEmail must be valid');
  }
  if (!draft.supportedCountries.length) throw new Error('at least one supported country is required');
  if (new Set(draft.supportedCountries).size !== draft.supportedCountries.length) throw new Error('supportedCountries must be unique');
  if (!draft.categories.length) throw new Error('at least one category is required');
  const keys = draft.categories.map((category) => category.key.trim());
  if (keys.some((key) => !key)) throw new Error('category key must not be empty');
  if (new Set(keys).size !== keys.length) throw new Error('category keys must be unique');
  if (draft.enabledFeatures.some((feature) => !feature.trim())) throw new Error('enabledFeatures must not contain empty values');
  const onboardingFields = draft.onboarding.map((field) => field.field.trim());
  if (onboardingFields.some((field) => !field)) throw new Error('onboarding field must not be empty');
  if (new Set(onboardingFields).size !== onboardingFields.length) throw new Error('onboarding fields must be unique');
}

export function publishQuickLaunchConfiguration(
  draft: QuickLaunchDraft,
  version: number,
  publishedAt: string,
): PublishedQuickLaunchConfiguration {
  validateQuickLaunchDraft(draft);
  if (!Number.isSafeInteger(version) || version < 1) throw new Error('version must be a positive safe integer');
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) throw new Error('publishedAt must be a valid instant');
  return Object.freeze({
    ...draft,
    ...(draft.legalSupport ? (() => { const privacyPolicyUrl=draft.legalSupport.privacyPolicyUrl?.trim()||undefined, termsOfServiceUrl=draft.legalSupport.termsOfServiceUrl?.trim()||undefined, supportUrl=draft.legalSupport.supportUrl?.trim()||undefined, supportEmail=draft.legalSupport.supportEmail?.trim().toLowerCase()||undefined; return privacyPolicyUrl||termsOfServiceUrl||supportUrl||supportEmail ? { legalSupport: Object.freeze({ ...(privacyPolicyUrl?{privacyPolicyUrl}:{}), ...(termsOfServiceUrl?{termsOfServiceUrl}:{}), ...(supportUrl?{supportUrl}:{}), ...(supportEmail?{supportEmail}:{}) }) } : {}; })() : {}),
    ...(draft.featureVisibility ? { featureVisibility: Object.freeze({ features: Object.freeze(draft.featureVisibility.features.map(feature => Object.freeze({ ...feature }))) }) } : {}),
    ...(draft.matchingRules ? { matchingRules: Object.freeze({ rules: Object.freeze(draft.matchingRules.rules.map(rule => Object.freeze({ key: rule.key.trim(), targetField: rule.targetField.trim(), operator: rule.operator, value: rule.value, enabled: rule.enabled, ...(rule.weight !== undefined ? { weight: rule.weight } : {}) }))) }) } : {}),
    ...(draft.profileSchema ? { profileSchema: Object.freeze({ fields: Object.freeze(draft.profileSchema.fields.map(field => Object.freeze({ ...field, ...(field.options ? { options: Object.freeze([...field.options]) } : {}) }))) }) } : {}),
    ...(draft.localization ? { localization: Object.freeze({ ...draft.localization, supportedLocales: Object.freeze([...draft.localization.supportedLocales]), ...(draft.localization.countryLocales ? { countryLocales: Object.freeze({ ...draft.localization.countryLocales }) } : {}) }) } : {}),
    ...(draft.brandingTheme ? { brandingTheme: Object.freeze({ ...draft.brandingTheme, ...(draft.brandingTheme.typography ? { typography: Object.freeze({ ...draft.brandingTheme.typography }) } : {}) }) } : {}),
    applicationName: draft.applicationName.trim(),
    primaryColor: draft.primaryColor.toUpperCase(),
    supportedCountries: Object.freeze([...draft.supportedCountries]),
    categories: Object.freeze(draft.categories.map((category) => Object.freeze({
      key: category.key.trim(),
      displayName: category.displayName.trim(),
    }))),
    enabledFeatures: Object.freeze([...draft.enabledFeatures]),
    onboarding: Object.freeze(draft.onboarding.map((field) => Object.freeze({
      field: field.field.trim(),
      required: field.required,
    }))),
    version,
    publishedAt: date.toISOString(),
  });
}
