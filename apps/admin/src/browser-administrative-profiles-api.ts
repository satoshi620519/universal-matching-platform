export interface AdministrativeProfileSummary {
  readonly id: string;
  readonly accountId: string;
  readonly categoryId: string;
  readonly scopeKind: string;
  readonly verificationStatus: string;
  readonly avatarStatus: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AdministrativeProfilePage {
  readonly items: readonly AdministrativeProfileSummary[];
  readonly nextCursor: string | null;
}

export interface AdministrativeProfilesApi {
  list(input?: { readonly cursor?: string; readonly limit?: number }): Promise<AdministrativeProfilePage>;
}

export function createBrowserAdministrativeProfilesApi(): AdministrativeProfilesApi {
  return {
    async list(input = {}) {
      const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
      const query = new URLSearchParams();
      if (input.cursor) query.set('cursor', input.cursor);
      if (input.limit) query.set('limit', String(input.limit));
      const response = await fetch(`${baseUrl}/administration/profiles${query.size ? `?${query}` : ''}`, {
        headers: {
          Accept: 'application/json',
          ...(import.meta.env.VITE_ADMIN_AUTHORIZATION
            ? { authorization: import.meta.env.VITE_ADMIN_AUTHORIZATION as string }
            : {}),
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Unable to load profiles (${response.status}).`);
      return response.json();
    },
  };
}
