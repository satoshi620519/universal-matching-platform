import { describe, expect, it, vi } from 'vitest';
import { RelationshipBlockService } from './relationship-block.service.js';

describe('RelationshipBlockService', () => {
  it('persists a directional block idempotently through the repository boundary', async () => {
    const blocks = { create: vi.fn().mockResolvedValue({ blockerAccountId: 'a', blockedAccountId: 'b' }) };
    const service = new RelationshipBlockService(blocks as never);
    await service.block({ blockerAccountId: 'a', blockedAccountId: 'b' });
    expect(blocks.create).toHaveBeenCalledWith('a', 'b');
  });
  it('rejects self blocking', async () => {
    const service = new RelationshipBlockService({ create: vi.fn(), existsBetween: vi.fn() } as never);
    await expect(service.block({ blockerAccountId: 'a', blockedAccountId: 'a' })).rejects.toThrow('cannot block itself');
  });
  it('evaluates communication policy bidirectionally', async () => {
    const blocks = { existsBetween: vi.fn().mockResolvedValue(true) };
    const service = new RelationshipBlockService(blocks as never);
    await expect(service.isBlockedBetween('a', 'b')).resolves.toBe(true);
    expect(blocks.existsBetween).toHaveBeenCalledWith('a', 'b');
  });
});
