import { describe, expect, it, vi } from 'vitest';
import { ConfigurationPublicationService } from './configuration-publication.service.js';

describe('ConfigurationPublicationService', () => {
  const draft = { id: 'draft-1', scope: 'deployment' as const, status: 'draft' as const, versionNumber: 2n, createdAt: new Date('2026-01-01') };

  it('atomically supersedes the current version and publishes the selected draft', async () => {
    const updateMany = vi.fn().mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 1 });
    const transaction = vi.fn(async (fn) => fn({ configurationVersion: { updateMany } }));
    const database = { $transaction: transaction };
    const versions = { findDraft: vi.fn().mockResolvedValue(draft) };
    const service = new ConfigurationPublicationService(database as any, versions as any);
    const publishedAt = new Date('2026-09-01T00:00:00Z');

    const result = await service.publish('draft-1', publishedAt);

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(updateMany).toHaveBeenNthCalledWith(1, expect.objectContaining({
      where: { scope: 'deployment', status: 'published' },
      data: { status: 'superseded', supersededAt: publishedAt },
    }));
    expect(updateMany).toHaveBeenNthCalledWith(2, expect.objectContaining({
      where: { id: 'draft-1', status: 'draft' },
      data: { status: 'published', publishedAt },
    }));
    expect(result.status).toBe('published');
  });

  it('publishes when no current version exists', async () => {
    const updateMany = vi.fn().mockResolvedValueOnce({ count: 0 }).mockResolvedValueOnce({ count: 1 });
    const service = new ConfigurationPublicationService(
      { $transaction: async (fn: any) => fn({ configurationVersion: { updateMany } }) } as any,
      { findDraft: vi.fn().mockResolvedValue(draft) } as any,
    );

    await expect(service.publish('draft-1')).resolves.toMatchObject({ status: 'published' });
  });

  it('rejects a missing draft before opening a transaction', async () => {
    const transaction = vi.fn();
    const service = new ConfigurationPublicationService(
      { $transaction: transaction } as any,
      { findDraft: vi.fn().mockResolvedValue(undefined) } as any,
    );

    await expect(service.publish('missing')).rejects.toThrow('configuration draft not found');
    expect(transaction).not.toHaveBeenCalled();
  });

  it('propagates transaction failures without reporting publication', async () => {
    const transaction = vi.fn().mockRejectedValue(new Error('transaction failed'));
    const service = new ConfigurationPublicationService(
      { $transaction: transaction } as any,
      { findDraft: vi.fn().mockResolvedValue(draft) } as any,
    );

    await expect(service.publish('draft-1')).rejects.toThrow('transaction failed');
  });
});
