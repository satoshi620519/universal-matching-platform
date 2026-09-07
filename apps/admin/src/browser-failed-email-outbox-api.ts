export type FailedEmailOutboxItem = Readonly<{
  id: string;
  [key: string]: unknown;
}>;

export type FailedEmailOutboxApi = Readonly<{
  list(limit?: number): Promise<readonly FailedEmailOutboxItem[]>;
  requeue(id: string): Promise<boolean>;
}>;

export function createBrowserFailedEmailOutboxApi(
  fetchImpl: typeof fetch = fetch,
): FailedEmailOutboxApi {
  const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '');
  const authorization = import.meta.env.VITE_ADMIN_AUTHORIZATION as string | undefined;
  const headers: HeadersInit = authorization ? { authorization } : {};

  return {
    async list(limit = 50) {
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error('limit must be an integer between 1 and 100');
      const response = await fetchImpl(`${baseUrl}/administration/failed-email-outbox?limit=${limit}`, { headers });
      if (!response.ok) throw new Error((await response.text().catch(() => '')) || `Failed email outbox request failed (${response.status})`);
      const value = await response.json();
      return Array.isArray(value) ? value.filter((item): item is FailedEmailOutboxItem => !!item && typeof item === 'object' && typeof (item as any).id === 'string') : [];
    },
    async requeue(id) {
      if (!id.trim()) throw new Error('id is required');
      const response = await fetchImpl(`${baseUrl}/administration/failed-email-outbox/${encodeURIComponent(id)}/requeue`, { method: 'POST', headers });
      if (!response.ok) throw new Error((await response.text().catch(() => '')) || `Failed email requeue failed (${response.status})`);
      const value = await response.json() as { requeued?: unknown };
      return value.requeued === true;
    },
  };
}
