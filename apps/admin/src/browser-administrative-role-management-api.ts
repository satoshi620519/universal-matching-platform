export type AdministrativeRole = 'administrator' | 'moderator';

// Transport vocabulary intentionally matches the existing HTTP controller.
// Bootstrap provisioning and unsupported domain-only roles remain outside this UI boundary.

export type AdministrativeRoleManagementApi = Readonly<{
  assign(input: { accountId: string; role: AdministrativeRole; effectiveAt?: string; expiresAt?: string }): Promise<void>;
  revoke(input: { accountId: string; role: AdministrativeRole; revokedAt?: string }): Promise<boolean>;
}>;

export function createBrowserAdministrativeRoleManagementApi(
  fetchImpl: typeof fetch = fetch,
): AdministrativeRoleManagementApi {
  const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '');
  const authorization = import.meta.env.VITE_ADMIN_AUTHORIZATION as string | undefined;
  const headers = { 'content-type': 'application/json', ...(authorization ? { authorization } : {}) };

  async function request(url: string, body: object) {
    const response = await fetchImpl(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!response.ok) throw new Error((await response.text().catch(() => '')) || `Administrative role request failed (${response.status})`);
    return response.json();
  }

  return {
    async assign(input) {
      if (!input.accountId.trim()) throw new Error('accountId is required');
      await request(`${baseUrl}/administration/roles/accounts/${encodeURIComponent(input.accountId)}/assign`, {
        role: input.role, ...(input.effectiveAt ? { effectiveAt: input.effectiveAt } : {}), ...(input.expiresAt ? { expiresAt: input.expiresAt } : {}),
      });
    },
    async revoke(input) {
      if (!input.accountId.trim()) throw new Error('accountId is required');
      const value = await request(`${baseUrl}/administration/roles/accounts/${encodeURIComponent(input.accountId)}/${encodeURIComponent(input.role)}/revoke`, input.revokedAt ? { revokedAt: input.revokedAt } : {});
      return (value as { revoked?: unknown }).revoked === true;
    },
  };
}
