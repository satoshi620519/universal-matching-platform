import { describe, expect, it } from 'vitest';
import { signIn, signOut } from './auth.js';
import type { CredentialStore, MobileApiClient } from './index.js';

function store(): CredentialStore & { value: string | null } {
  let current: string | null = null;
  return {
    get: async () => current,
    set: async (value) => { current = value; },
    clear: async () => { current = null; },
    get value() { return current; },
  };
}

describe('mobile authentication', () => {
  it('stores the credential only through the credential boundary', async () => {
    const credentials = store();
    let call = 0;
    const client: MobileApiClient = {
      request: async () => {
        call += 1;
        if (call === 1) return { credential: 'token' } as never;
        return { id: 'a1', status: 'active', createdAt: 'c', updatedAt: 'u' } as never;
      },
    };
    await expect(signIn(client, credentials, 'a@example.com', 'password')).resolves.toMatchObject({ id: 'a1' });
    expect(credentials.value).toBe('token');
  });

  it('clears credentials on sign out', async () => {
    const credentials = store();
    await credentials.set('token');
    await signOut(credentials);
    expect(credentials.value).toBeNull();
  });
});
