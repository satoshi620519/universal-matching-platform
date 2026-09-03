import type { QuickLaunchDraft } from './quick-launch-configuration.js';

export interface BrandingThemeConfiguration {
  readonly logoUrl?: string;
  readonly primaryColor: string;
  readonly secondaryColor?: string;
  readonly accentColor?: string;
  readonly typography?: {
    readonly fontFamily?: string;
    readonly headingFontFamily?: string;
    readonly borderRadius?: 'none' | 'small' | 'medium' | 'large';
  };
}

export function defaultBrandingThemeConfiguration(draft: Pick<QuickLaunchDraft, 'logoUrl' | 'primaryColor'>): BrandingThemeConfiguration {
  return Object.freeze({
    logoUrl: draft.logoUrl,
    primaryColor: draft.primaryColor,
    borderRadius: undefined,
  });
}

export function validateBrandingThemeConfiguration(configuration: BrandingThemeConfiguration): void {
  for (const [name, value] of Object.entries({
    primaryColor: configuration.primaryColor,
    secondaryColor: configuration.secondaryColor,
    accentColor: configuration.accentColor,
  })) {
    if (value !== undefined && !/^#[0-9A-Fa-f]{6}$/.test(value)) throw new Error(`${name} must be a #RRGGBB value`);
  }
  if (configuration.logoUrl !== undefined && !configuration.logoUrl.trim()) throw new Error('logoUrl must not be empty');
  const typography = configuration.typography;
  if (typography?.fontFamily !== undefined && !typography.fontFamily.trim()) throw new Error('fontFamily must not be empty');
  if (typography?.headingFontFamily !== undefined && !typography.headingFontFamily.trim()) throw new Error('headingFontFamily must not be empty');
}
