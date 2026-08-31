import { describe, expect, it, vi } from 'vitest';

import { SessionRevocationService } from './session-revocation.service.js';

describe('SessionRevocationService', () => {
  it('delegates revocation with a current timestamp', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-31T00:00:00.000Z'));
    const revoke = vi.fn().mockResolvedValue(undefined);
    const service = new SessionRevocationService({ revoke } as any);

    await service.revoke('session-1');

    expect(revoke).toHaveBeenCalledWith(
      'session-1',
      new Date('2026-08-31T00:00:00.000Z'),
    );
    vi.useRealTimers();
  });
});
