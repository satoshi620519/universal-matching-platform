export interface ApiEnvironment {
  baseUrl: string;
}

export interface CredentialStore {
  get(): Promise<string | null>;
  set(credential: string): Promise<void>;
  clear(): Promise<void>;
}

export type Account = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export class MobileApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export type MobileApiClient = {
  request<T>(path: string, init?: RequestInit): Promise<T>;
};

export function createMobileApiClient(
  environment: ApiEnvironment,
  credentials: CredentialStore,
  fetcher: typeof fetch = fetch,
): MobileApiClient {
  return {
    async request<T>(path, init = {}) {
      const credential = await credentials.get();
      const headers = new Headers(init.headers);
      if (!headers.has('content-type') && init.body) headers.set('content-type', 'application/json');
      if (credential) headers.set('authorization', 'Bearer ' + credential);

      const response = await fetcher(environment.baseUrl + path, { ...init, headers });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) await credentials.clear();
        throw new MobileApiError('Request failed', response.status);
      }
      return response.json() as Promise<T>;
    },
  };
}

export type SessionState =
  | { kind: 'restoring' }
  | { kind: 'unauthenticated' }
  | { kind: 'authenticated'; account: Account };

export async function restoreSession(
  client: MobileApiClient,
  credentials: CredentialStore,
): Promise<SessionState> {
  if (!(await credentials.get())) return { kind: 'unauthenticated' };
  try {
    const account = await client.request<Account>('/accounts/authenticated');
    return { kind: 'authenticated', account };
  } catch (error) {
    if (error instanceof MobileApiError && (error.status === 401 || error.status === 403)) {
      await credentials.clear();
      return { kind: 'unauthenticated' };
    }
    throw error;
  }
}

export const mobileFoundation = true;
