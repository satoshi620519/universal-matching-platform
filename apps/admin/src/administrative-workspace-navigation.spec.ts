import { describe, expect, it, vi } from 'vitest';

import { createBrowserAdministrativeCapabilitiesApi } from './browser-administrative-capabilities-api';

describe('administrative capability navigation contract', () => {
  it('derives visible workspace targets only from granted server capabilities', async () => {
    const api = createBrowserAdministrativeCapabilitiesApi(vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ capabilities: ['manage-quick-launch', 'manage-moderation'] }),
    }) as any);

    const granted = new Set(await api.list());
    const targets = [
      ['quick-launch', 'manage-quick-launch'],
      ['moderation', 'manage-moderation'],
      ['roles', 'manage-administrative-roles'],
      ['failed-email', 'review-failed-email-outbox'],
    ].filter(([, capability]) => granted.has(capability as any)).map(([target]) => target);

    expect(targets).toEqual(['quick-launch', 'moderation']);
  });
});
