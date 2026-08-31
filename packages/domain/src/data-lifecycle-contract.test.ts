import { describe, expect, it } from 'vitest';
import {
  distinguishesLifecycleActions,
  hasBackupLifecycle,
  hasDocumentedDeletionLifecycle,
  hasDocumentedRetentionPolicy,
  hasExplicitScopedRetentionException,
} from './data-lifecycle-contract.js';

describe('data lifecycle retention contract', () => {
  it('requires a documented purpose and policy for each data class', () => {
    expect(
      hasDocumentedRetentionPolicy({
        dataClass: 'profile',
        retentionPurpose: 'account operation',
        policyReference: 'RET-001',
      }),
    ).toBe(true);
  });

  it('requires user deletion to enter a documented lifecycle', () => {
    expect(
      hasDocumentedDeletionLifecycle({
        requested: true,
        documentedLifecycle: ['delete', 'revoke-access'],
      }),
    ).toBe(true);
    expect(
      hasDocumentedDeletionLifecycle({
        requested: true,
        documentedLifecycle: [],
      }),
    ).toBe(false);
  });

  it('requires retention exceptions to be explicit and scoped', () => {
    expect(
      hasExplicitScopedRetentionException({
        reason: 'fraud-prevention',
        scope: 'fraud investigation records',
        expiresAt: '2027-01-01T00:00:00.000Z',
      }),
    ).toBe(true);
    expect(
      hasExplicitScopedRetentionException({
        reason: 'legal',
        scope: '',
      }),
    ).toBe(false);
  });

  it('keeps lifecycle actions semantically distinct', () => {
    expect(
      distinguishesLifecycleActions([
        'delete',
        'anonymize',
        'revoke-access',
        'archive',
      ]),
    ).toBe(true);
    expect(distinguishesLifecycleActions(['delete', 'delete'])).toBe(false);
  });

  it('requires backup expiration and recovery lifecycle definitions', () => {
    expect(
      hasBackupLifecycle({
        expirationPolicy: 'expire after retention window',
        recoveryLifecycle: 'restore then validate',
      }),
    ).toBe(true);
  });
});
