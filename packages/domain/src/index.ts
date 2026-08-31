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
export * from './entitlement.js';
export * from './verification.js';
export * from './safety-restriction.js';
export * from './report.js';
export * from './moderation-case.js';

export * from './moderation-action.js';

export * from './audit-record.js';

export * from './analytics-event.js';

export * from './metric-definition.js';

export * from './metric-report.js';

export * from './safety-metric.js';

export * from './analytics-governance.js';

export * from './report-privacy-control.js';
