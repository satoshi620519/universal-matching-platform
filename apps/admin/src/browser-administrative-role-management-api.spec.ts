import { describe, expect, it, vi } from 'vitest';
import { createBrowserAdministrativeRoleManagementApi } from './browser-administrative-role-management-api';

describe('createBrowserAdministrativeRoleManagementApi', () => {
  it('assigns roles through the existing audited endpoint', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ assigned: true }) });
    await createBrowserAdministrativeRoleManagementApi(fetchImpl as any).assign({ accountId: 'account-1', role: 'moderator' });
    expect(fetchImpl).toHaveBeenCalledWith('/administration/roles/accounts/account-1/assign', expect.objectContaining({ method: 'POST' }));
  });

  it('returns the existing revoke result', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ revoked: true }) });
    await expect(createBrowserAdministrativeRoleManagementApi(fetchImpl as any).revoke({ accountId: 'account-1', role: 'administrator' })).resolves.toBe(true);
  });
});
