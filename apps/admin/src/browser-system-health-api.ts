import type { SystemHealthApi } from './system-health-panel';

export function createBrowserSystemHealthApi(): SystemHealthApi {
  return {
    async health() {
      const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
      const response = await fetch(`${baseUrl}/health`, { headers: { Accept: 'application/json', ...(import.meta.env.VITE_ADMIN_AUTHORIZATION ? { authorization: import.meta.env.VITE_ADMIN_AUTHORIZATION as string } : {}) }, credentials: 'include' });
      if (!response.ok) throw new Error(`Unable to load system health (${response.status}).`);
      return response.json();
    },
  };
}
