import type { BrandingThemeConfiguration } from './branding-theme-configuration.js';

export interface QuickLaunchDraft {
  readonly applicationName: string;
  readonly logoUrl?: string;
  readonly primaryColor: string;
  /** Optional richer branding/theme extension; legacy primaryColor/logoUrl remain supported. */
  readonly brandingTheme?: BrandingThemeConfiguration;
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
