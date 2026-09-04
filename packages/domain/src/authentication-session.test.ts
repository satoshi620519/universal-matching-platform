import { describe, expect, it } from 'vitest';
import {
  assertAuthenticationSessionBoundary,
  isAuthenticationSessionActive,
  type AuthenticationSessionRecord,
} from './authentication-session.js';

const issuedAt = new Date('2026-09-04T00:00:00.000Z');
const active: AuthenticationSessionRecord = {
  id: 'session-1',
  accountId: 'account-1',
  authenticationIdentityId: 'identity-1',
  issuedAt,
  expiresAt: new Date('2026-09-05T00:00:00.000Z'),
  revokedAt: null,
};

describe('authentication session boundary', () => {
  it('accepts a server-authoritative active session lifecycle record', () => {
    expect(() => assertAuthenticationSessionBoundary(active)).not.toThrow();
    expect(isAuthenticationSessionActive(active, new Date('2026-09-04T01:00:00.000Z'))).toBe(true);
  });

  it('treats revoked or expired sessions as inactive', () => {
    expect(isAuthenticationSessionActive({ ...active, revokedAt: issuedAt }, new Date('2026-09-04T01:00:00.000Z'))).toBe(false);
    expect(isAuthenticationSessionActive(active, new Date('2026-09-06T00:00:00.000Z'))).toBe(false);
  });

  it('rejects expiry at or before issuance', () => {
    expect(() => assertAuthenticationSessionBoundary({ ...active, expiresAt: issuedAt })).toThrow('expiry');
  });
});
