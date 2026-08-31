import { describe, expect, it } from 'vitest';
import {
  distinguishesInstallationGuideModes,
  hasDocumentedDeploymentPrerequisites,
  hasDocumentedIntegrationRequirements,
  hasSafeSecretHandling,
  isExternalizedEnvironmentConfiguration,
} from './deployment-installation-contract.js';

describe('deployment installation contract', () => {
  it('requires documented supported deployment prerequisites', () => {
    expect(
      hasDocumentedDeploymentPrerequisites([
        { name: 'Node runtime', documented: true },
      ]),
    ).toBe(true);
  });

  it('externalizes environment-specific configuration', () => {
    expect(
      isExternalizedEnvironmentConfiguration({
        key: 'DATABASE_URL',
        environmentSpecific: true,
        storedInApplicationSource: false,
      }),
    ).toBe(true);
  });

  it('keeps secrets out of ordinary committed configuration', () => {
    expect(
      hasSafeSecretHandling({
        secretName: 'API_KEY',
        storedInOrdinaryCommittedConfig: false,
        documentedProvisioningMechanism: 'secret manager',
      }),
    ).toBe(true);
  });

  it('distinguishes quick launch from advanced customization', () => {
    expect(
      distinguishesInstallationGuideModes([
        { mode: 'quick-launch', documentedSteps: ['configure env'] },
        { mode: 'advanced-customization', documentedSteps: ['configure provider'] },
      ]),
    ).toBe(true);
  });

  it('documents credentials and dependencies for supported integrations', () => {
    expect(
      hasDocumentedIntegrationRequirements({
        integration: 'identity provider',
        requiredCredentials: ['client id'],
        requiredCallbacks: [],
        operationalDependencies: ['provider availability'],
      }),
    ).toBe(true);
  });
});
