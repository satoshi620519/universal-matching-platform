import { describe, expect, it, vi } from 'vitest';

import { EmailVerificationService } from './email-verification.service.js';

describe('EmailVerificationService', () => {
  it('issues a 30-minute opaque token while storing only its hash', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-31T00:00:00.000Z'));
    const create = vi.fn().mockResolvedValue({});
    const service = new EmailVerificationService(
      {} as any,
      { create } as any,
    );

    const raw = await service.issue('account-1');

    expect(raw).toBeTruthy();
    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      accountId: 'account-1',
      expiresAt: new Date('2026-08-31T00:30:00.000Z'),
    }));
    expect(create.mock.calls[0][0].tokenHash).not.toBe(raw);
    vi.useRealTimers();
  });

  it('activates a pending account after atomically consuming a usable token', async () => {
    const consumeIfUsable = vi.fn().mockResolvedValue({ accountId: 'account-1' });
    const updateStatus = vi.fn().mockResolvedValue({ id: 'account-1' });
    const service = new EmailVerificationService(
      { findById: vi.fn().mockResolvedValue({ id: 'account-1', status: 'pending-onboarding' }), updateStatus } as any,
      { consumeIfUsable } as any,
    );

    await expect(service.verify('token')).resolves.toEqual({
      kind: 'verified',
      accountId: 'account-1',
    });
    expect(updateStatus).toHaveBeenCalledWith('account-1', 'active');
  });

  it('rejects unusable tokens without exposing the reason', async () => {
    const service = new EmailVerificationService(
      {} as any,
      { consumeIfUsable: vi.fn().mockResolvedValue(null) } as any,
    );

    await expect(service.verify('expired-or-used')).resolves.toEqual({ kind: 'rejected' });
  });
});
