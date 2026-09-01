import { describe, expect, it, vi } from 'vitest';
import { ConfigurationReversionService } from './configuration-reversion.service.js';
describe('ConfigurationReversionService', () => {
  it('creates a new draft from immutable history and publishes it', async () => {
    const versions = { findByVersionNumber: vi.fn().mockResolvedValue({ id: 'old', status: 'superseded', scope: 'deployment' }), nextVersionNumber: vi.fn().mockResolvedValue(4n), createDraftFromVersion: vi.fn().mockResolvedValue({ id: 'new-draft' }) };
    const publication = { publish: vi.fn().mockResolvedValue({ id: 'new-published', status: 'published' }) };
    const audit = { append: vi.fn().mockResolvedValue(undefined) };
    const service = new ConfigurationReversionService(versions as any, publication as any, audit as any);
    await expect(service.revert('deployment', 2n, { actorId: 'admin' })).resolves.toMatchObject({ id: 'new-published' });
    expect(versions.createDraftFromVersion).toHaveBeenCalledWith('old', 4n);
    expect(audit.append).toHaveBeenCalledWith(expect.objectContaining({ action: 'revert-configuration-version' }));
  });
  it('rejects missing history before mutation', async () => {
    const versions = { findByVersionNumber: vi.fn().mockResolvedValue(undefined), nextVersionNumber: vi.fn(), createDraftFromVersion: vi.fn() };
    const service = new ConfigurationReversionService(versions as any, {} as any, {} as any);
    await expect(service.revert('deployment', 2n, { actorId: 'admin' })).rejects.toThrow('historical version not found');
    expect(versions.createDraftFromVersion).not.toHaveBeenCalled();
  });
});