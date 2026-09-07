import { describe, expect, it, vi } from 'vitest';
import { RelationshipBlockService } from './relationship-block.service.js';

describe('relationship block compatibility boundary', () => {
  it('treats either directional block as a blocked relationship', async () => {
    const repository = { existsBetween: vi.fn().mockResolvedValue(true), create: vi.fn() };
    const service = new RelationshipBlockService(repository as never);
    expect(await service.isBlockedBetween('account-a', 'account-b')).toBe(true);
  });
  it('does not query persistence for the same account', async () => {
    const repository = { existsBetween: vi.fn(), create: vi.fn() };
    const service = new RelationshipBlockService(repository as never);
    expect(await service.isBlockedBetween('account-a', 'account-a')).toBe(false);
    expect(repository.existsBetween).not.toHaveBeenCalled();
  });
});
