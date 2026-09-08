import { describe, expect, it, vi } from 'vitest';

import { SessionIssuanceService } from './session-issuance.service.js';

describe('SessionIssuanceService', () => {
  it('uses an opaque 256-bit credential that is not persisted raw', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'session-1' });
    const service = new SessionIssuanceService({ create } as any);
    const issued = await service.issue({ accountId: 'account-1', authenticationMethod: 'password' });
    expect(issued.credential).toHaveLength(43);
    expect(create.mock.calls[0][0].credentialHash).not.toBe(issued.credential);
  });

  it('creates a session with an expiration in the future', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-31T00:00:00.000Z'));
    const create = vi.fn().mockResolvedValue({ id: 'session-1' });
    const service = new SessionIssuanceService({ create } as any);

    await service.issue({
      accountId: 'account-1',
      authenticationMethod: 'password',
    });

    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      accountId: 'account-1',
      authenticationMethod: 'password',
      expiresAt: new Date('2026-09-07T00:00:00.000Z'),
      credentialHash: expect.any(String),
    }));
    vi.useRealTimers();
  });
});
