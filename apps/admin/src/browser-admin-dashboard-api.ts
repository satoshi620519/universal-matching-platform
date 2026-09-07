export interface AdminDashboardApi {
  read(): Promise<{
    systemHealth: { status: 'ok' | 'degraded'; database: 'configured' | 'not-configured' };
    availableSections: readonly string[];
  }>;
}

export function createBrowserAdminDashboardApi(): AdminDashboardApi {
  return {
    async read() {
      const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
      const response = await fetch(`${baseUrl}/administration/dashboard`, {
        headers: {
          Accept: 'application/json',
          ...(import.meta.env.VITE_ADMIN_AUTHORIZATION
            ? { authorization: import.meta.env.VITE_ADMIN_AUTHORIZATION as string }
            : {}),
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Unable to load dashboard (${response.status}).`);
      return response.json();
    },
  };
}
