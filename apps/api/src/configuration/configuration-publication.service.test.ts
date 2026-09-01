import { describe, expect, it, vi } from 'vitest';
import { ConfigurationPublicationService } from './configuration-publication.service.js';

describe('ConfigurationPublicationService', () => {
  const draft = { id: 'draft-1', scope: 'deployment' as const, status: 'draft' as const, versionNumber: 2n, createdAt: new Date('2026-01-01') };
  const context = { actorId: 'admin-1', correlationId: 'corr-1' };

  function service(updateMany: any, findDraft = vi.fn().mockResolvedValue(draft), audit = { append: vi.fn().mockResolvedValue(undefined) }) {
    return {
      instance: new ConfigurationPublicationService(
        { $transaction: async (fn: any) => fn({ configurationVersion: { updateMany } }) } as any,
        { findDraft } as any,
        audit as any,
      ),
      audit,
    };
  }

  it('atomically supersedes the current version, publishes the draft, then audits success', async () => {
    const updateMany = vi.fn().mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 1 });
    const { instance, audit } = service(updateMany);
    const publishedAt = new Date('2026-09-01T00:00:00Z');

    const result = await instance.publish('draft-1', context, publishedAt);

    expect(updateMany).toHaveBeenNthCalledWith(1, expect.objectContaining({ where: { scope: 'deployment', status: 'published' } }));
    expect(updateMany).toHaveBeenNthCalledWith(2, expect.objectContaining({ where: { id: 'draft-1', status: 'draft' } }));
    expect(audit.append).toHaveBeenCalledWith(expect.objectContaining({
      actorId: 'admin-1', area: 'configuration', action: 'publish-configuration-version',
      targetId: 'draft-1', correlationId: 'corr-1',
    }));
    expect(result.status).toBe('published');
  });

  it('publishes when no current version exists', async () => {
    const updateMany = vi.fn().mockResolvedValueOnce({ count: 0 }).mockResolvedValueOnce({ count: 1 });
    const { instance } = service(updateMany);
    await expect(instance.publish('draft-1', context)).resolves.toMatchObject({ status: 'published' });
  });

  it('rejects a missing draft before mutation or audit', async () => {
    const updateMany = vi.fn();
    const audit = { append: vi.fn() };
    const { instance } = service(updateMany, vi.fn().mockResolvedValue(undefined), audit);
    await expect(instance.publish('missing', context)).rejects.toThrow('configuration draft not found');
    expect(updateMany).not.toHaveBeenCalled();
    expect(audit.append).not.toHaveBeenCalled();
  });

  it('does not audit when publication transaction fails', async () => {
    const audit = { append: vi.fn() };
    const instance = new ConfigurationPublicationService(
      { $transaction: vi.fn().mockRejectedValue(new Error('transaction failed')) } as any,
      { findDraft: vi.fn().mockResolvedValue(draft) } as any,
      audit as any,
    );
    await expect(instance.publish('draft-1', context)).rejects.toThrow('transaction failed');
    expect(audit.append).not.toHaveBeenCalled();
  });
});
