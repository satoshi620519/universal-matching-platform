import { describe, expect, it } from 'vitest';
import { AccountActivationService } from './account-activation.service.js';

describe('AccountActivationService', () => {
  const service = new AccountActivationService();

  it('activates an account from pending onboarding', () => {
    expect(service.activate('pending-onboarding')).toEqual({ state: 'active' });
  });

  it('restores a restricted account', () => {
    expect(service.activate('restricted')).toEqual({ state: 'active' });
  });

  it('rejects suspended accounts', () => {
    expect(() => service.activate('suspended')).toThrow('Account cannot be activated from state: suspended');
  });

  it('rejects anonymized accounts', () => {
    expect(() => service.activate('deleted-anonymized')).toThrow(
      'Account cannot be activated from state: deleted-anonymized',
    );
  });
});
