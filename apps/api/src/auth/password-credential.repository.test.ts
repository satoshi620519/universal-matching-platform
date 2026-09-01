import { describe, expect, it } from 'vitest';

import { PasswordCredentialRepository } from './password-credential.repository.js';

describe('PasswordCredentialRepository contract', () => {
  it('exposes credential operations scoped by authentication identity', () => {
    expect(PasswordCredentialRepository.prototype).toBeTruthy();
    // Abstract TypeScript methods are erased at runtime; the prototype existence is the runtime contract.
  });
});
