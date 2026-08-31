import { describe, expect, it } from 'vitest';

import { PasswordCredentialRepository } from './password-credential.repository.js';

describe('PasswordCredentialRepository contract', () => {
  it('exposes credential operations scoped by authentication identity', () => {
    expect(PasswordCredentialRepository.prototype.create).toBeTypeOf('function');
    expect(
      PasswordCredentialRepository.prototype.findByAuthenticationIdentityId,
    ).toBeTypeOf('function');
    expect(
      PasswordCredentialRepository.prototype.replacePasswordHash,
    ).toBeTypeOf('function');
    expect(
      PasswordCredentialRepository.prototype.updateStatus,
    ).toBeTypeOf('function');
  });
});
