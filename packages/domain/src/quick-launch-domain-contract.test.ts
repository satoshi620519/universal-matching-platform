import { describe, expect, it } from 'vitest';
import { QUICK_LAUNCH_DOMAIN_CONTRACTS, getQuickLaunchDomainContract } from './quick-launch-domain-contract.js';

describe('Quick Launch domain contract', () => {
  it('covers every supported Quick Launch configuration domain exactly once', () => {
    expect(QUICK_LAUNCH_DOMAIN_CONTRACTS.map(contract => contract.domain)).toEqual([
      'brandingTheme', 'localization', 'categories', 'profileSchema',
      'featureVisibility', 'matchingRules', 'legalSupport', 'notificationPresentation',
    ]);
    expect(new Set(QUICK_LAUNCH_DOMAIN_CONTRACTS.map(contract => contract.domain)).size).toBe(8);
  });

  it('keeps shared publication, migration, and authorization boundaries explicit', () => {
    for (const contract of QUICK_LAUNCH_DOMAIN_CONTRACTS) {
      expect(contract.quickLaunchVisible).toBe(true);
      expect(contract.publicationBehavior).toBe('immutable-versioned-snapshot');
      expect(contract.migrationCompatibility).toBe('additive-optional');
      expect(contract.authorizationBoundary).toBe('backend-authoritative');
      expect(contract.defaultSemantics).not.toBe('');
      expect(contract.advancedCustomizationExtensionPoint).not.toBe('');
    }
  });

  it('retrieves a stable domain contract', () => {
    expect(getQuickLaunchDomainContract('matchingRules').advancedCustomizationExtensionPoint)
      .toContain('matching algorithms');
  });
});
