import { describe, expect, it } from 'vitest';
import { AccountDeletionRequestService } from './account-deletion-request.service.js';

describe('AccountDeletionRequestService', () => {
  const service = new AccountDeletionRequestService();

  it.each(['pending-onboarding', 'active', 'restricted', 'suspended'] as const)(
    'marks %s accounts pending deletion',
    (state) => {
      expect(service.requestDeletion(state)).toEqual({ state: 'pending-deletion' });
    },
  );

  it('rejects an already pending deletion account', () => {
    expect(() => service.requestDeletion('pending-deletion')).toThrow(
      'Account cannot be marked for deletion from state: pending-deletion',
    );
  });

  it('rejects anonymized accounts', () => {
    expect(() => service.requestDeletion('deleted-anonymized')).toThrow(
      'Account cannot be marked for deletion from state: deleted-anonymized',
    );
  });
});
