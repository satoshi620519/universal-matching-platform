export interface AdminDashboardApi {
  read(): Promise<{
    systemHealth: { status: 'ok' | 'degraded'; database: 'configured' | 'not-configured' };
    availableSections: readonly string[];
  }>;
}

export function createBrowserAdminDashboardApi(): AdminDashboardApi {
  return {
    async read() {
      const response = await fetch('/administration/dashboard', {
        headers: { Accept: 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Unable to load dashboard (${response.status}).`);
      return response.json();
    },
  };
}
