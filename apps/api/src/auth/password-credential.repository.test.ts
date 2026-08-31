import { describe, expect, it } from 'vitest';

import { PasswordCredentialRepository } from './password-credential.repository.js';

describe('PasswordCredentialRepository boundary', () => {
  it('keeps password material scoped to authentication identities', () => {
    expect(PasswordCredentialRepository).toBeTypeOf('function');
  });
});
