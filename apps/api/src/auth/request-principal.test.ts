import { describe, expect, it } from 'vitest';
import { isAuthenticatedPrincipal, type RequestPrincipal } from './request-principal.js';

describe('request principal contract', () => {
  const principal: RequestPrincipal = {
    accountId: '00000000-0000-0000-0000-000000000001',
    authenticationMethod: 'provider-neutral',
    sessionId: 'session-1',
  };

  it('accepts an identity provider-neutral principal', () => {
    expect(isAuthenticatedPrincipal(principal)).toBe(true);
  });

  it('rejects a missing principal', () => {
    expect(isAuthenticatedPrincipal(undefined)).toBe(false);
  });
});
