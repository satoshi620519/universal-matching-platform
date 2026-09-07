export interface AdministrativeMatchInteraction {
  readonly id: string;
  readonly actorAccountId: string;
  readonly targetAccountId: string;
  readonly decision: string;
  readonly createdAt: string;
}
export interface AdministrativeMatchPage { readonly items: readonly AdministrativeMatchInteraction[]; readonly nextCursor: string | null; }
export interface AdministrativeMatchesApi { list(input?: { cursor?: string; limit?: number }): Promise<AdministrativeMatchPage>; }

export function createBrowserAdministrativeMatchesApi(): AdministrativeMatchesApi {
  return {
    async list(input = {}) {
      const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
      const query = new URLSearchParams();
      if (input.cursor) query.set('cursor', input.cursor);
      if (input.limit) query.set('limit', String(input.limit));
      const response = await fetch(`${baseUrl}/administration/matches${query.size ? `?${query}` : ''}`, {
        headers: { Accept: 'application/json' }, credentials: 'include',
      });
      if (!response.ok) throw new Error(`Unable to load matches (${response.status}).`);
      return response.json();
    },
  };
}
