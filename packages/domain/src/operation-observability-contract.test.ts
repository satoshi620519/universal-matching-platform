import { describe, expect, it } from 'vitest';
import {
  hasActionableFailureSignal,
  hasRecoveryReadiness,
  hasStructuredOperationRecord,
  isValidOperationalState,
  supportsCorrelation,
} from './operation-observability-contract.js';

describe('operational observability recovery contract', () => {
  it('requires actionable failure signals with at least one signal type', () => {
    expect(
      hasActionableFailureSignal({
        severity: 'critical',
        actionable: true,
        signalTypes: ['alert', 'log'],
      }),
    ).toBe(true);
  });

  it('requires backup, recovery and rollback readiness', () => {
    expect(
      hasRecoveryReadiness({
        backupDefined: true,
        recoveryDefined: true,
        rollbackOrRecoveryDefined: true,
      }),
    ).toBe(true);
  });

  it('requires structured records to minimize sensitive content', () => {
    expect(
      hasStructuredOperationRecord({
        operation: 'match-evaluation',
        containsSensitiveContent: false,
      }),
    ).toBe(true);
    expect(
      hasStructuredOperationRecord({
        operation: 'match-evaluation',
        containsSensitiveContent: true,
      }),
    ).toBe(false);
  });

  it('supports correlation identifiers for observable workflows', () => {
    expect(
      supportsCorrelation({
        operation: 'message-delivery',
        correlationId: 'corr-123',
        containsSensitiveContent: false,
      }),
    ).toBe(true);
  });

  it('distinguishes healthy, degraded and failed operational states', () => {
    expect(isValidOperationalState('healthy')).toBe(true);
    expect(isValidOperationalState('degraded')).toBe(true);
    expect(isValidOperationalState('failed')).toBe(true);
    expect(isValidOperationalState('unknown')).toBe(false);
  });
});
