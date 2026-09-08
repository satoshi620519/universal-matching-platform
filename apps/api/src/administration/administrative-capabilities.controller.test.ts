import { describe, expect, it, vi } from 'vitest';

import { AdministrativeCapabilitiesController } from './administrative-capabilities.controller.js';

describe('AdministrativeCapabilitiesController', () => {
  it('returns only granted capabilities for the authenticated principal', async () => {
    const resolver = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'admin-1' }) };
    const access = { can: vi.fn(async (_id: string, capability: string) => capability !== 'manage-moderation') };
    const controller = new AdministrativeCapabilitiesController(resolver as any, access as any);

    await expect(controller.list('Bearer session')).resolves.toEqual({
      capabilities: [
        'manage-administrative-roles',
        'review-failed-email-outbox',
        'manage-quick-launch',
        'view-analytics',
      ],
    });
    expect(resolver.requireAuthenticated).toHaveBeenCalledWith({
      authorization: 'Bearer session',
      requestId: 'administration-me-capabilities',
    });
  });

  it('uses a supplied correlation id as the request id', async () => {
    const resolver = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'admin-1' }) };
    const access = { can: vi.fn().mockResolvedValue(false) };
    const controller = new AdministrativeCapabilitiesController(resolver as any, access as any);

    await expect(controller.list('Bearer session', ' trace-1 ')).resolves.toEqual({ capabilities: [] });
    expect(resolver.requireAuthenticated).toHaveBeenCalledWith({
      authorization: 'Bearer session',
      requestId: 'trace-1',
    });
  });
});
