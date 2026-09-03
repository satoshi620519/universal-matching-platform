export interface QuickLaunchDraftInput {
  applicationName: string;
  logoUrl?: string;
  primaryColor: string;
  localization?: { defaultLocale: string; supportedLocales: readonly string[]; defaultTimezone?: string; countryLocales?: Readonly<Record<string,string>> };
  brandingTheme?: {
    primaryColor: string;
    secondaryColor?: string;
    accentColor?: string;
    typography?: { fontFamily?: string; headingFontFamily?: string; borderRadius?: 'none'|'small'|'medium'|'large' };
  };
  supportedCountries: readonly string[];
  profileSchema?: { fields: readonly { key: string; label: string; type: 'text'|'number'|'boolean'|'date'|'select'; required?: boolean; visibility: 'public'|'authenticated'|'privileged'; options?: readonly string[] }[] };
  featureVisibility?: { features: readonly { key: string; enabled: boolean }[] };
  legalSupport?: { privacyPolicyUrl?: string; termsOfServiceUrl?: string; supportUrl?: string; supportEmail?: string };
  terminology?: { terms: Partial<Record<'user'|'profile'|'discovery'|'match'|'matches'|'message'|'messages', string>> };
  matchingCategories?: { categories: readonly { key: string; label: string; description?: string; enabled: boolean }[] };
  matchingRules?: { rules: readonly { key: string; field: string; operator: 'equals'|'notEquals'|'contains'|'withinDistance'|'minimumScore'; value: string|number|boolean; enabled: boolean; weight?: number }[] };
  categories: readonly { key: string; displayName: string }[];
  enabledFeatures: readonly string[];
  onboarding: readonly { field: string; required: boolean }[];
}

export interface QuickLaunchApi {
  request(path: string, init?: { method?: string; body?: unknown }): Promise<unknown>;
}

export function createQuickLaunchWorkflow(api: QuickLaunchApi) {
  return {
    createDraft: (draft: QuickLaunchDraftInput) =>
      api.request('/administration/quick-launch/drafts', { method: 'POST', body: draft }),
    saveDraft: (version: number, draft: QuickLaunchDraftInput) =>
      api.request(`/administration/quick-launch/drafts/${version}`, { method: 'POST', body: draft }),
    publish: (version: number) =>
      api.request(`/administration/quick-launch/drafts/${version}/publish`, { method: 'POST' }),
    published: () => api.request('/administration/quick-launch/published'),
    history: () => api.request('/administration/quick-launch/history'),
  };
}

export const quickLaunchSteps = [
  'Branding',
  'Regions',
  'Categories',
  'Profile Schema',
  'Matching Categories',
  'Features',
  'Legal & Support',
  'Terminology',
  'Matching Rules',
  'Onboarding',
  'Review & Publish',
] as const;
