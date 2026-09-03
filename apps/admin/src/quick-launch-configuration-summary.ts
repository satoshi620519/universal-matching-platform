import type { QuickLaunchPublishedRecord } from './quick-launch-history';

type SnapshotLike = {
  applicationName?: unknown;
  primaryColor?: unknown;
  localization?: { defaultLocale?: unknown; supportedLocales?: unknown; defaultTimezone?: unknown; countryLocales?: unknown };
  brandingTheme?: {
    primaryColor?: unknown;
    secondaryColor?: unknown;
    accentColor?: unknown;
    typography?: { fontFamily?: unknown; headingFontFamily?: unknown; borderRadius?: unknown };
  };
};

function snapshotOf(record: QuickLaunchPublishedRecord): SnapshotLike {
  const value = record.snapshot ?? record.configuration;
  return value && typeof value === 'object' ? value as SnapshotLike : {};
}

export interface QuickLaunchConfigurationSummary {
  applicationName: string;
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  headingFontFamily?: string;
  borderRadius?: string;
  defaultLocale?: string;
  supportedLocales?: readonly string[];
  defaultTimezone?: string;
  countryLocales?: Readonly<Record<string,string>>;
}

export function summarizeQuickLaunchConfiguration(record: QuickLaunchPublishedRecord): QuickLaunchConfigurationSummary {
  const snapshot = snapshotOf(record);
  const theme = snapshot.brandingTheme;
  const typography = theme?.typography;
  return {
    applicationName: typeof snapshot.applicationName === 'string' ? snapshot.applicationName : 'Unnamed configuration',
    primaryColor: typeof snapshot.primaryColor === 'string' ? snapshot.primaryColor : typeof theme?.primaryColor === 'string' ? theme.primaryColor : 'Default',
    secondaryColor: typeof theme?.secondaryColor === 'string' ? theme.secondaryColor : undefined,
    accentColor: typeof theme?.accentColor === 'string' ? theme.accentColor : undefined,
    fontFamily: typeof typography?.fontFamily === 'string' ? typography.fontFamily : undefined,
    headingFontFamily: typeof typography?.headingFontFamily === 'string' ? typography.headingFontFamily : undefined,
    borderRadius: typeof typography?.borderRadius === 'string' ? typography.borderRadius : undefined,
    defaultLocale: typeof snapshot.localization?.defaultLocale === 'string' ? snapshot.localization.defaultLocale : undefined,
    supportedLocales: Array.isArray(snapshot.localization?.supportedLocales) && snapshot.localization.supportedLocales.every((value): value is string => typeof value === 'string') ? snapshot.localization.supportedLocales : undefined,
    defaultTimezone: typeof snapshot.localization?.defaultTimezone === 'string' ? snapshot.localization.defaultTimezone : undefined,
    countryLocales: snapshot.localization?.countryLocales && typeof snapshot.localization.countryLocales === 'object' && !Array.isArray(snapshot.localization.countryLocales) ? Object.fromEntries(Object.entries(snapshot.localization.countryLocales as Record<string, unknown>).filter((entry): entry is [string,string] => typeof entry[1] === 'string')) : undefined,
  };
}
