export type InstallationGuideMode = 'quick-launch' | 'advanced-customization';

export interface DeploymentPrerequisite {
  readonly name: string;
  readonly documented: boolean;
}

export interface ExternalizedConfiguration {
  readonly key: string;
  readonly environmentSpecific: boolean;
  readonly storedInApplicationSource: boolean;
}

export interface SecretHandling {
  readonly secretName: string;
  readonly storedInOrdinaryCommittedConfig: boolean;
  readonly documentedProvisioningMechanism: string;
}

export interface InstallationGuide {
  readonly mode: InstallationGuideMode;
  readonly documentedSteps: readonly string[];
}

export interface IntegrationRequirement {
  readonly integration: string;
  readonly requiredCredentials: readonly string[];
  readonly requiredCallbacks: readonly string[];
  readonly operationalDependencies: readonly string[];
}

export function hasDocumentedDeploymentPrerequisites(
  prerequisites: readonly DeploymentPrerequisite[],
): boolean {
  return (
    prerequisites.length > 0 &&
    prerequisites.every((item) => item.name.trim().length > 0 && item.documented)
  );
}

export function isExternalizedEnvironmentConfiguration(
  configuration: ExternalizedConfiguration,
): boolean {
  return (
    configuration.key.trim().length > 0 &&
    configuration.environmentSpecific &&
    !configuration.storedInApplicationSource
  );
}

export function hasSafeSecretHandling(secret: SecretHandling): boolean {
  return (
    secret.secretName.trim().length > 0 &&
    !secret.storedInOrdinaryCommittedConfig &&
    secret.documentedProvisioningMechanism.trim().length > 0
  );
}

export function distinguishesInstallationGuideModes(
  guides: readonly InstallationGuide[],
): boolean {
  const modes = new Set(guides.map((guide) => guide.mode));
  return (
    modes.has('quick-launch') &&
    modes.has('advanced-customization') &&
    guides.every((guide) => guide.documentedSteps.length > 0)
  );
}

export function hasDocumentedIntegrationRequirements(
  requirement: IntegrationRequirement,
): boolean {
  return (
    requirement.integration.trim().length > 0 &&
    requirement.requiredCredentials.length > 0 &&
    requirement.operationalDependencies.length > 0
  );
}
