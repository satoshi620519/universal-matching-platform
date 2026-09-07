export interface AdministrativeModerationReport {
  readonly id: string; readonly targetId: string; readonly targetType: string; readonly status: string; readonly createdAt: string;
}
export interface AdministrativeModerationCase {
  readonly id: string; readonly reportId: string; readonly targetId: string; readonly status: string; readonly createdAt: string;
}
export interface AdministrativeModerationPage<T> { readonly items: readonly T[]; readonly nextCursor: string | null; }
export type ReportStatus = 'submitted' | 'triaged' | 'actioned' | 'dismissed';
export type ModerationActionType = 'warning' | 'restrict-features' | 'restrict-communication' | 'suspend' | 'close-without-action';
export type ModerationCaseStatus = 'under-review' | 'actioned' | 'closed';
export interface AdministrativeModerationApi {
  listReports(input?: { cursor?: string; limit?: number }): Promise<AdministrativeModerationPage<AdministrativeModerationReport>>;
  listCases(input?: { cursor?: string; limit?: number }): Promise<AdministrativeModerationPage<AdministrativeModerationCase>>;
  transitionReport(id: string, status: ReportStatus): Promise<unknown>;
  openCase(reportId: string): Promise<unknown>;
  transitionCase(id: string, status: ModerationCaseStatus): Promise<unknown>;
  applyAction(caseId: string, input: { targetId: string; action: ModerationActionType; reasonCategory: string }): Promise<unknown>;
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
  const mutate = async (path: string, body?: unknown): Promise<unknown> => {
    const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
    const response = await fetch(`${baseUrl}${path}`, { method: 'POST', credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(import.meta.env.VITE_ADMIN_AUTHORIZATION ? { authorization: import.meta.env.VITE_ADMIN_AUTHORIZATION as string } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    if (!response.ok) throw new Error(`Unable to update moderation data (${response.status}).`);
    return response.json();
  };
  return {
    listReports: (input) => request('/administration/moderation/reports', input),
    listCases: (input) => request('/administration/moderation/cases', input),
    transitionReport: (id, status) => mutate(`/safety/moderation/reports/${id}/transition`, { status }),
    openCase: (reportId) => mutate(`/safety/moderation/reports/${reportId}/case`),
    transitionCase: (id, status) => mutate(`/safety/moderation/cases/${id}/transition`, { status }),
    applyAction: (caseId, input) => mutate(`/safety/moderation/cases/${caseId}/actions`, input),
  };
}
