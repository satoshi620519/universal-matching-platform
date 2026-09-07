import type { QuickLaunchApi } from './quick-launch-workflow';

export function createBrowserQuickLaunchApi(): QuickLaunchApi {
  const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
  return {
    async request(path, init = {}) {
      const response = await fetch(`${baseUrl}${path}`, {
        method: init.method ?? 'GET',
        headers: {
          ...(init.body !== undefined ? { 'content-type': 'application/json' } : {}),
        },
        credentials: 'include',
        body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        throw new Error(detail || `Quick Launch request failed (${response.status})`);
      }
      if (response.status === 204) return undefined;
      return response.json();
    },
  };
}
