import { describe, expect, it } from 'vitest';
import { MobileApiError, restoreSession, type CredentialStore, type MobileApiClient } from './index.js';

function store(initial: string | null): CredentialStore & { cleared: number } {
  let value = initial;
  let cleared = 0;
  return {
    get: async () => value,
    set: async (credential) => { value = credential; },
    clear: async () => { value = null; cleared += 1; },
    get cleared() { return cleared; },
  };
}

describe('restoreSession', () => {
  it('is unauthenticated without a credential', async () => {
    const credentials = store(null);
    const client: MobileApiClient = { request: async () => { throw new Error('must not call'); } };
    await expect(restoreSession(client, credentials)).resolves.toEqual({ kind: 'unauthenticated' });
  });

  it('restores an authenticated account', async () => {
    const credentials = store('token');
    const client: MobileApiClient = { request: async () => ({ id: 'a1', status: 'active', createdAt: 'c', updatedAt: 'u' }) };
    await expect(restoreSession(client, credentials)).resolves.toMatchObject({ kind: 'authenticated', account: { id: 'a1' } });
  });

  it('clears invalid credentials', async () => {
    const credentials = store('bad');
    const client: MobileApiClient = { request: async () => { throw new MobileApiError('no', 401); } };
    await expect(restoreSession(client, credentials)).resolves.toEqual({ kind: 'unauthenticated' });
    expect(credentials.cleared).toBe(1);
  });
});
