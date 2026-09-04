import { describe, expect, it } from 'vitest';
import {
  assertPasswordCredentialBoundary,
  canVerifyPasswordCredential,
  type PasswordCredentialRecord,
} from './password-credential.js';

const active: PasswordCredentialRecord = {
  authenticationIdentityId: 'identity-1',
  passwordHash: 'opaque-hash',
  status: 'active',
  createdAt: new Date('2026-09-04T00:00:00.000Z'),
  updatedAt: new Date('2026-09-04T00:00:00.000Z'),
};

describe('password credential boundary', () => {
  it('accepts a dedicated identity-linked active credential', () => {
    expect(() => assertPasswordCredentialBoundary(active)).not.toThrow();
    expect(canVerifyPasswordCredential(active)).toBe(true);
  });

  it('rejects missing opaque hash material', () => {
    expect(() => assertPasswordCredentialBoundary({ ...active, passwordHash: ' ' }))
      .toThrow('hash');
  });

  it('prevents disabled credentials from verification', () => {
    expect(canVerifyPasswordCredential({ ...active, status: 'disabled' })).toBe(false);
  });
});
