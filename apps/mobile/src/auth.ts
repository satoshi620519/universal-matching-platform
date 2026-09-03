import type { Account, CredentialStore, MobileApiClient } from './index.js';

export async function signIn(
  client: MobileApiClient,
  credentials: CredentialStore,
  email: string,
  password: string,
): Promise<Account> {
  const result = await client.request<{ credential?: string }>('/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!result.credential) throw new Error('Sign-in response did not include a credential');

  await credentials.set(result.credential);
  try {
    return await client.request<Account>('/accounts/authenticated');
  } catch (error) {
    await credentials.clear();
    throw error;
  }
}

export async function signOut(credentials: CredentialStore): Promise<void> {
  await credentials.clear();
}
