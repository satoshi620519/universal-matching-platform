export type EntityId = string & { readonly __brand: 'EntityId' };

export function createEntityId(value: string): EntityId {
  const normalized = value.trim();
  if (!normalized) throw new Error('EntityId must not be empty');
  return normalized as EntityId;
}

export type InstantString = string & { readonly __brand: 'InstantString' };

export function createInstantString(value: string): InstantString {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid instant');
  return date.toISOString() as InstantString;
}

export class DomainError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export * from './account.js';
export * from './capability.js';
export * from './capability-decision.js';
export * from './entitlement.js';
export * from './verification.js';
export * from './safety-restriction.js';
export * from './safety-enforcement.js';
export * from './effective-safety-restriction.js';
export * from './report.js';
export * from './moderation-case.js';

export * from './moderation-action.js';
export * from './audit-record.js';
export * from './administrative-role.js';
export * from './analytics-event.js';
export * from './metric-definition.js';
export * from './metric-report.js';
export * from './safety-metric.js';
export * from './analytics-governance.js';
export * from './report-privacy-control.js';
export * from './analytics-audit.js';
export * from './analytics-deployment-policy.js';
export * from './accessibility-contract.js';
export * from './accessibility-flow.js';
export * from './accessibility-assurance.js';
export * from './operation-performance-contract.js';
export * from './operation-resilience-contract.js';
export * from './operation-observability-contract.js';
export * from './data-lifecycle-contract.js';
export * from './data-lifecycle-governance-contract.js';
export * from './deployment-installation-contract.js';
export * from './deployment-readiness-contract.js';
export * from './configuration-resolution.js';
export {
  ConfigurationSettingDefinition as DraftConfigurationSettingDefinition,
  DraftConfigurationValue,
  validateDraftConfigurationValue,
} from './configuration-setting-definition.js';
export * from './category.js';
export * from './geographic-scope.js';
export * from './profile.js';
export * from './profile-completion.js';
export * from './category-repository.js';
export * from './profile-repository.js';
export * from './profile-field-schema.js';
export * from './profile-projection.js';
export * from './location-precision.js';
export * from './private-location.js';
export * from './distance-presentation.js';
export * from './discovery-query.js';
export * from './discovery-sorting.js';
export * from './discovery-preferences.js';
export * from './discovery-search.js';
export * from './discovery-eligibility.js';
export * from './match-strategy.js';
export * from './match-compatibility.js';
export * from './match-strategy-selection.js';
export * from './match-strategy-configuration.js';
export * from './rule-based-match-strategy.js';
export * from './match-transition.js';
export * from './match-transition-state.js';
export * from './conversation.js';

export * from './quick-launch-configuration.js';
export * from './quick-launch-domain-contract.js';
export * from './matching-rules-configuration.js';
export * from './notification-presentation-preferences.js';

export * from './branding-theme-configuration.js';

export * from './localization-configuration.js';

export * from './profile-schema-configuration.js';

export * from './feature-visibility-configuration.js';

export * from './password-credential.js';

export * from './authentication-session.js';

export * from './password-recovery.js';
