import type { QuickLaunchPublishedRecord } from './quick-launch-history';

type SnapshotLike = {
  applicationName?: unknown;
  profileSchema?: { fields?: unknown[] };
  featureVisibility?: { features?: unknown[] };
  terminology?: { terms?: unknown };
  matchingCategories?: { categories?: unknown[] };
  categories?: unknown[];
  matchingRules?: { rules?: unknown[] };
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
  profileFieldCount?: number;
  requiredProfileFieldCount?: number;
  profileFieldKeys?: readonly string[];
  visibleFeatureCount?: number;
  visibleFeatureKeys?: readonly string[];
  terminologyCount?: number;
  terminology?: Readonly<Record<string,string>>;
  matchingCategoryCount?: number;
  matchingCategoryKeys?: readonly string[];
  enabledMatchingCategoryCount?: number;
  matchingRuleCount?: number;
  enabledMatchingRuleCount?: number;
  matchingRuleKeys?: readonly string[];
}

export function summarizeQuickLaunchConfiguration(record: QuickLaunchPublishedRecord): QuickLaunchConfigurationSummary {
  const snapshot = snapshotOf(record);
  const theme = snapshot.brandingTheme;
  const typography = theme?.typography;
  const visibleFeatureKeys = Array.isArray(snapshot.featureVisibility?.features) ? snapshot.featureVisibility.features.filter((feature): feature is { key: string; enabled?: unknown } => !!feature && typeof feature === 'object' && typeof (feature as { key?: unknown }).key === 'string' && (feature as { enabled?: unknown }).enabled === true).map(feature=>feature.key) : undefined;
  const terminology = snapshot.terminology?.terms && typeof snapshot.terminology.terms === 'object' && !Array.isArray(snapshot.terminology.terms) ? Object.fromEntries(Object.entries(snapshot.terminology.terms as Record<string, unknown>).filter((entry): entry is [string,string] => typeof entry[1] === 'string' && entry[1].trim().length>0).map(([key,value])=>[key,value.trim()])) : undefined;
  const configuredCategories = Array.isArray(snapshot.matchingCategories?.categories) ? snapshot.matchingCategories.categories : Array.isArray(snapshot.categories) ? snapshot.categories : undefined;
  const normalizedCategories = configuredCategories?.flatMap((category)=>category && typeof category === 'object' && typeof (category as { key?: unknown }).key === 'string' ? [{key:(category as {key:string}).key,enabled:(category as {enabled?:unknown}).enabled!==false}] : []);
  const normalizedRules = Array.isArray(snapshot.matchingRules?.rules) ? snapshot.matchingRules.rules.flatMap((rule)=>rule && typeof rule === 'object' && typeof (rule as { key?: unknown }).key === 'string' ? [{key:(rule as {key:string}).key,enabled:(rule as {enabled?:unknown}).enabled!==false}] : []) : undefined;
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
    profileFieldCount: Array.isArray(snapshot.profileSchema?.fields) ? snapshot.profileSchema.fields.length : undefined,
    requiredProfileFieldCount: Array.isArray(snapshot.profileSchema?.fields) ? snapshot.profileSchema.fields.filter(field => field && typeof field === 'object' && (field as { required?: unknown }).required === true).length : undefined,
    profileFieldKeys: Array.isArray(snapshot.profileSchema?.fields) ? snapshot.profileSchema.fields.map(field => field && typeof field === 'object' && typeof (field as { key?: unknown }).key === 'string' ? (field as { key: string }).key : undefined).filter((key): key is string => key !== undefined) : undefined,
    visibleFeatureCount: visibleFeatureKeys?.length,
    visibleFeatureKeys,
    terminologyCount: terminology ? Object.keys(terminology).length : undefined,
    terminology,
    matchingCategoryCount: normalizedCategories?.length,
    matchingCategoryKeys: normalizedCategories?.map(category=>category.key),
    enabledMatchingCategoryCount: normalizedCategories?.filter(category=>category.enabled).length,
    matchingRuleCount: normalizedRules?.length,
    enabledMatchingRuleCount: normalizedRules?.filter(rule=>rule.enabled).length,
    matchingRuleKeys: normalizedRules?.map(rule=>rule.key),
    countryLocales: snapshot.localization?.countryLocales && typeof snapshot.localization.countryLocales === 'object' && !Array.isArray(snapshot.localization.countryLocales) ? Object.fromEntries(Object.entries(snapshot.localization.countryLocales as Record<string, unknown>).filter((entry): entry is [string,string] => typeof entry[1] === 'string')) : undefined,
  };
}
