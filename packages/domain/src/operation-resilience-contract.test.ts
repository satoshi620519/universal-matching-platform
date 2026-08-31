import { describe, expect, it } from 'vitest';
import {
  doesNotBlockUserTransaction,
  hasBoundedObservableRetries,
  hasDefinedDegradedBehavior,
  optionalDependencyFailureIsIsolated,
} from './operation-resilience-contract.js';

describe('operational resilience contract', () => {
  it('keeps background operations from blocking user transactions', () => {
    expect(
      doesNotBlockUserTransaction({
        name: 'refresh recommendations',
        blocksUserTransaction: false,
      }),
    ).toBe(true);
  });

  it('requires degraded behavior for critical dependencies', () => {
    expect(
      hasDefinedDegradedBehavior({
        dependency: 'identity provider',
        critical: true,
        degradedBehavior: 'show retry state',
      }),
    ).toBe(true);
    expect(
      hasDefinedDegradedBehavior({
        dependency: 'identity provider',
        critical: true,
      }),
    ).toBe(false);
  });

  it('isolates optional dependency failures from core capability decisions', () => {
    expect(
      optionalDependencyFailureIsIsolated({
        dependency: 'analytics exporter',
        critical: false,
      }),
    ).toBe(true);
  });

  it('requires bounded and observable retries', () => {
    expect(
      hasBoundedObservableRetries({
        maxAttempts: 3,
        observable: true,
      }),
    ).toBe(true);
    expect(
      hasBoundedObservableRetries({
        maxAttempts: 11,
        observable: true,
      }),
    ).toBe(false);
  });
});
