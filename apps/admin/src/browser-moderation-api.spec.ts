import { describe, expect, it, vi } from 'vitest';
import { createBrowserModerationApi } from './browser-moderation-api';

describe('createBrowserModerationApi', () => {
  it('lists moderation reports with query parameters and admin authorization', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ id: 'r1' }]), { status: 200 }));
    vi.stubEnv('VITE_API_URL', 'https://api.example.test');
    vi.stubEnv('VITE_ADMIN_AUTHORIZATION', 'Bearer admin-token');

    const api = createBrowserModerationApi(fetchImpl);
    await expect(api.listReports({ status: 'triaged', limit: 25 })).resolves.toEqual([{ id: 'r1' }]);

    expect(fetchImpl).toHaveBeenCalledWith('https://api.example.test/safety/moderation/reports?status=triaged&limit=25', expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({ authorization: 'Bearer admin-token' }),
    }));
  });

  it('posts report and case moderation commands to the canonical safety routes', async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'r1', status: 'triaged' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'c1' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'c1', status: 'actioned' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ caseId: 'c1', action: 'suspend' }), { status: 200 }));
    vi.stubEnv('VITE_API_URL', 'https://api.example.test');
    vi.stubEnv('VITE_ADMIN_AUTHORIZATION', 'Bearer admin-token');

    const api = createBrowserModerationApi(fetchImpl);
    await api.transitionReport('r/1', 'triaged');
    await api.openCase('r/1');
    await api.transitionCase('c/1', 'actioned');
    await api.applyAction({ caseId: 'c/1', targetId: 'u1', action: 'suspend', reasonCategory: 'abuse' });

    expect(fetchImpl.mock.calls.map(([url, init]) => [url, (init as RequestInit).method, (init as RequestInit).body])).toEqual([
      ['https://api.example.test/safety/moderation/reports/r%2F1/transition', 'POST', JSON.stringify({ status: 'triaged' })],
      ['https://api.example.test/safety/moderation/reports/r%2F1/case', 'POST', undefined],
      ['https://api.example.test/safety/moderation/cases/c%2F1/transition', 'POST', JSON.stringify({ status: 'actioned' })],
      ['https://api.example.test/safety/moderation/cases/c%2F1/actions', 'POST', JSON.stringify({ caseId: 'c/1', targetId: 'u1', action: 'suspend', reasonCategory: 'abuse' })],
    ]);
  });

  it('surfaces non-success responses instead of hiding authorization failures', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('Forbidden', { status: 403 }));
    vi.stubEnv('VITE_API_URL', 'https://api.example.test');
    const api = createBrowserModerationApi(fetchImpl);

    await expect(api.listReports()).rejects.toThrow('Forbidden');
  });
});
