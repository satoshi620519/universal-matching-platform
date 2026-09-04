export type QuickLaunchConfigurationDomain =
  | 'brandingTheme'
  | 'localization'
  | 'categories'
  | 'profileSchema'
  | 'featureVisibility'
  | 'matchingRules'
  | 'legalSupport'
  | 'notificationPresentation';

export interface QuickLaunchDomainContract {
  readonly domain: QuickLaunchConfigurationDomain;
  readonly quickLaunchVisible: true;
  readonly defaultSemantics: string;
  readonly advancedCustomizationExtensionPoint: string;
  readonly publicationBehavior: 'immutable-versioned-snapshot';
  readonly migrationCompatibility: 'additive-optional';
  readonly authorizationBoundary: 'backend-authoritative';
}

export const QUICK_LAUNCH_DOMAIN_CONTRACTS: readonly QuickLaunchDomainContract[] = Object.freeze([
  { domain: 'brandingTheme', quickLaunchVisible: true, defaultSemantics: 'legacy primaryColor/logoUrl remain valid when richer theme metadata is omitted', advancedCustomizationExtensionPoint: 'custom UI components and typography tokens', publicationBehavior: 'immutable-versioned-snapshot', migrationCompatibility: 'additive-optional', authorizationBoundary: 'backend-authoritative' },
  { domain: 'localization', quickLaunchVisible: true, defaultSemantics: 'supportedCountries remains required; richer locale metadata is optional', advancedCustomizationExtensionPoint: 'locale providers and custom UI translation components', publicationBehavior: 'immutable-versioned-snapshot', migrationCompatibility: 'additive-optional', authorizationBoundary: 'backend-authoritative' },
  { domain: 'categories', quickLaunchVisible: true, defaultSemantics: 'key/displayName remain sufficient; description and enabled are optional', advancedCustomizationExtensionPoint: 'category-specific policy modules', publicationBehavior: 'immutable-versioned-snapshot', migrationCompatibility: 'additive-optional', authorizationBoundary: 'backend-authoritative' },
  { domain: 'profileSchema', quickLaunchVisible: true, defaultSemantics: 'existing onboarding fields remain valid when richer profile schema is omitted', advancedCustomizationExtensionPoint: 'custom profile field types', publicationBehavior: 'immutable-versioned-snapshot', migrationCompatibility: 'additive-optional', authorizationBoundary: 'backend-authoritative' },
  { domain: 'featureVisibility', quickLaunchVisible: true, defaultSemantics: 'omission leaves existing feature behavior unchanged', advancedCustomizationExtensionPoint: 'plugins/extensions', publicationBehavior: 'immutable-versioned-snapshot', migrationCompatibility: 'additive-optional', authorizationBoundary: 'backend-authoritative' },
  { domain: 'matchingRules', quickLaunchVisible: true, defaultSemantics: 'omission preserves engine-owned matching behavior', advancedCustomizationExtensionPoint: 'custom matching algorithms/scoring adapters', publicationBehavior: 'immutable-versioned-snapshot', migrationCompatibility: 'additive-optional', authorizationBoundary: 'backend-authoritative' },
  { domain: 'legalSupport', quickLaunchVisible: true, defaultSemantics: 'omitted destinations remain absent', advancedCustomizationExtensionPoint: 'API integrations and webhooks', publicationBehavior: 'immutable-versioned-snapshot', migrationCompatibility: 'additive-optional', authorizationBoundary: 'backend-authoritative' },
  { domain: 'notificationPresentation', quickLaunchVisible: true, defaultSemantics: 'when configured, omitted supported presentation types resolve to enabled', advancedCustomizationExtensionPoint: 'provider adapters', publicationBehavior: 'immutable-versioned-snapshot', migrationCompatibility: 'additive-optional', authorizationBoundary: 'backend-authoritative' },
]);

export function getQuickLaunchDomainContract(domain: QuickLaunchConfigurationDomain): QuickLaunchDomainContract {
  const contract = QUICK_LAUNCH_DOMAIN_CONTRACTS.find(candidate => candidate.domain === domain);
  if (!contract) throw new Error('Quick Launch domain contract is missing');
  return contract;
}
