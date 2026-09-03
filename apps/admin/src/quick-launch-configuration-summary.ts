import type { QuickLaunchPublishedRecord } from './quick-launch-history';

type SnapshotLike = {
  applicationName?: unknown;
  primaryColor?: unknown;
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
  };
}
