export interface AdministrativeModerationReport {
  readonly id: string; readonly targetId: string; readonly targetType: string; readonly status: string; readonly createdAt: string;
}
export interface AdministrativeModerationCase {
  readonly id: string; readonly reportId: string; readonly status: string; readonly createdAt: string;
}
export interface AdministrativeModerationPage<T> { readonly items: readonly T[]; readonly nextCursor: string | null; }
export interface AdministrativeModerationApi {
  listReports(input?: { cursor?: string; limit?: number }): Promise<AdministrativeModerationPage<AdministrativeModerationReport>>;
  listCases(input?: { cursor?: string; limit?: number }): Promise<AdministrativeModerationPage<AdministrativeModerationCase>>;
}
export function createBrowserAdministrativeModerationApi(): AdministrativeModerationApi {
  const request = async <T,>(path: string, input: { cursor?: string; limit?: number } = {}): Promise<AdministrativeModerationPage<T>> => {
    const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
    const query = new URLSearchParams();
    if (input.cursor) query.set('cursor', input.cursor);
    if (input.limit) query.set('limit', String(input.limit));
    const response = await fetch(`${baseUrl}${path}${query.size ? `?${query}` : ''}`, {
      headers: { Accept: 'application/json', ...(import.meta.env.VITE_ADMIN_AUTHORIZATION ? { authorization: import.meta.env.VITE_ADMIN_AUTHORIZATION as string } : {}) },
      credentials: 'include',
    });
    if (!response.ok) throw new Error(`Unable to load moderation data (${response.status}).`);
    return response.json();
  };
  return {
    listReports: (input) => request('/administration/moderation/reports', input),
    listCases: (input) => request('/administration/moderation/cases', input),
  };
}
