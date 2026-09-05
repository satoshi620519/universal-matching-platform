export type ModerationReport = Readonly<Record<string, unknown>>;
export type ModerationCase = Readonly<Record<string, unknown>>;
export type ModerationActionResult = Readonly<Record<string, unknown>>;

export type ModerationApi = Readonly<{
  listReports(input?: { status?: 'submitted' | 'triaged'; limit?: number }): Promise<ModerationReport[]>;
  transitionReport(reportId: string, status: 'triaged' | 'actioned' | 'dismissed'): Promise<ModerationReport>;
  openCase(reportId: string): Promise<ModerationCase>;
  transitionCase(caseId: string, status: 'under-review' | 'actioned' | 'closed'): Promise<ModerationCase>;
  applyAction(input: { caseId: string; targetId: string; action: 'warning' | 'restrict-features' | 'restrict-communication' | 'suspend' | 'ban' | 'close-without-action'; reasonCategory: string; expiresAt?: string }): Promise<ModerationActionResult>;
}>;

type RequestOptions = Readonly<{ method?: string; body?: unknown }>;

export function createBrowserModerationApi(fetchImpl: typeof fetch = fetch): ModerationApi {
  const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
  const authorization = import.meta.env.VITE_ADMIN_AUTHORIZATION as string | undefined;

  async function request(path: string, init: RequestOptions = {}) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        ...(init.body !== undefined ? { 'content-type': 'application/json' } : {}),
        ...(authorization ? { authorization } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(detail || `Moderation request failed (${response.status})`);
    }
    if (response.status === 204) return undefined;
    return response.json();
  }

  return {
    async listReports(input = {}) {
      const params = new URLSearchParams();
      if (input.status) params.set('status', input.status);
      if (input.limit !== undefined) params.set('limit', String(input.limit));
      const suffix = params.toString() ? `?${params.toString()}` : '';
      const result = await request(`/safety/moderation/reports${suffix}`);
      return Array.isArray(result) ? result : Array.isArray((result as { reports?: unknown[] } | undefined)?.reports) ? (result as { reports: unknown[] }).reports : [];
    },
    transitionReport(reportId, status) {
      return request(`/safety/moderation/reports/${encodeURIComponent(reportId)}/transition`, { method: 'POST', body: { status } }) as Promise<ModerationReport>;
    },
    openCase(reportId) {
      return request(`/safety/moderation/reports/${encodeURIComponent(reportId)}/case`, { method: 'POST' }) as Promise<ModerationCase>;
    },
    transitionCase(caseId, status) {
      return request(`/safety/moderation/cases/${encodeURIComponent(caseId)}/transition`, { method: 'POST', body: { status } }) as Promise<ModerationCase>;
    },
    applyAction(input) {
      return request(`/safety/moderation/cases/${encodeURIComponent(input.caseId)}/actions`, { method: 'POST', body: input }) as Promise<ModerationActionResult>;
    },
  };
}
