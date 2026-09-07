export interface AdministrativeUserSummary {
  readonly id: string;
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AdministrativeUserPage {
  readonly items: readonly AdministrativeUserSummary[];
  readonly nextCursor: string | null;
}

export interface AdministrativeUsersApi {
  list(input?: { readonly cursor?: string; readonly limit?: number }): Promise<AdministrativeUserPage>;
}

export function createBrowserAdministrativeUsersApi(): AdministrativeUsersApi {
  return {
    async list(input = {}) {
      const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
      const query = new URLSearchParams();
      if (input.cursor) query.set('cursor', input.cursor);
      if (input.limit) query.set('limit', String(input.limit));
      const response = await fetch(`${baseUrl}/administration/users${query.size ? `?${query}` : ''}`, {
        headers: {
          Accept: 'application/json',
          ...(import.meta.env.VITE_ADMIN_AUTHORIZATION
            ? { authorization: import.meta.env.VITE_ADMIN_AUTHORIZATION as string }
            : {}),
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Unable to load users (${response.status}).`);
      return response.json();
    },
  };
}
