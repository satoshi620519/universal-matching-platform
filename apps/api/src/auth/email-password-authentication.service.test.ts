import { describe, expect, it } from 'vitest';
import { EmailPasswordAuthenticationService } from './email-password-authentication.service.js';

const identity = { id: 'identity-1', accountId: 'account-1', authenticationMethod: 'email_password' };

describe('EmailPasswordAuthenticationService', () => {
  it('issues a session only after active credential verification', async () => {
    let issued = 0;
    const service = new EmailPasswordAuthenticationService(
      { findByEmail: async () => identity },
      { findByAuthenticationIdentityId: async () => ({ authenticationIdentityId: identity.id, passwordHash: 'hash', status: 'active' as const }) },
      { verify: async () => true },
      { issue: async () => { issued += 1; return { id: 'session-1' }; } },
    );
    const result = await service.authenticate({ email: 'user@example.com', password: 'secret' });
    expect(result.ok).toBe(true);
    expect(issued).toBe(1);
  });

  it('never issues a session for invalid credentials', async () => {
    let issued = 0;
    const service = new EmailPasswordAuthenticationService(
      { findByEmail: async () => identity },
      { findByAuthenticationIdentityId: async () => ({ authenticationIdentityId: identity.id, passwordHash: 'hash', status: 'active' as const }) },
      { verify: async () => false },
      { issue: async () => { issued += 1; return {}; } },
    );
    expect((await service.authenticate({ email: 'user@example.com', password: 'wrong' })).ok).toBe(false);
    expect(issued).toBe(0);
  });

  it('refuses disabled credentials before verification', async () => {
    let verified = 0;
    const service = new EmailPasswordAuthenticationService(
      { findByEmail: async () => identity },
      { findByAuthenticationIdentityId: async () => ({ authenticationIdentityId: identity.id, passwordHash: 'hash', status: 'disabled' as const }) },
      { verify: async () => { verified += 1; return true; } },
      { issue: async () => ({}) },
    );
    const result = await service.authenticate({ email: 'user@example.com', password: 'secret' });
    expect(result).toEqual({ ok: false, reason: 'credential_disabled' });
    expect(verified).toBe(0);
  });
});
