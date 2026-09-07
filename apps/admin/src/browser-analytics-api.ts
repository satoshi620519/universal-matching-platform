export type ReportingPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';
export type AnalyticsApi = Readonly<{ business(period: ReportingPeriod): Promise<unknown>; safety(period: ReportingPeriod): Promise<unknown> }>;
export function createBrowserAnalyticsApi(fetchImpl: typeof fetch = fetch): AnalyticsApi {
  const configured = import.meta.env.VITE_API_URL as string | undefined;
  const baseUrl = configured ? configured.replace(/\/$/, '') : '';
  const authorization = import.meta.env.VITE_ADMIN_AUTHORIZATION as string | undefined;
  const request = async (path: string) => {
    const response = await fetchImpl(baseUrl + path, { headers: authorization ? { authorization } : {} });
    if (!response.ok) throw new Error((await response.text().catch(() => '')) || `Analytics request failed (${response.status})`);
    return response.json();
  };
  return { business: (period) => request(`/admin/analytics/business/${period}`), safety: (period) => request(`/admin/analytics/safety/${period}`) };
}
