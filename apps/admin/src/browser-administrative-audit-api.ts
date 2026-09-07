export interface AdministrativeAuditRecord {
  readonly id: string;
  readonly actorId: string;
  readonly area: string;
  readonly action: string;
  readonly targetId: string | null;
  readonly correlationId: string | null;
  readonly occurredAt: string;
}
export interface AdministrativeAuditPage {
  readonly items: readonly AdministrativeAuditRecord[];
  readonly nextCursor: string | null;
}
export interface AdministrativeAuditApi {
  list(input?: { cursor?: string; limit?: number }): Promise<AdministrativeAuditPage>;
}
export function createBrowserAdministrativeAuditApi(): AdministrativeAuditApi {
  return {
    async list(input = {}) {
      const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
      const query = new URLSearchParams();
      if (input.cursor) query.set('cursor', input.cursor);
      if (input.limit) query.set('limit', String(input.limit));
      const response = await fetch(`${baseUrl}/administration/audit${query.size ? `?${query}` : ''}`, {
        headers: { Accept: 'application/json', ...(import.meta.env.VITE_ADMIN_AUTHORIZATION ? { authorization: import.meta.env.VITE_ADMIN_AUTHORIZATION as string } : {}) },
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Unable to load audit logs (${response.status}).`);
      return response.json();
    },
  };
}
