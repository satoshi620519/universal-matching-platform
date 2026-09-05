import { describe, expect, it, vi } from 'vitest';
import { AdminCapabilityAccessService } from './admin-capability-access.service.js';

describe('AdminCapabilityAccessService', () => {
  it('denies when no active roles grant the capability', async () => {
    const repository = { findActiveForAccount: vi.fn().mockResolvedValue([]) };
    const service = new AdminCapabilityAccessService(repository as never);
    await expect(service.hasCapability('a1', 'audit.read')).resolves.toBe(false);
  });
  it('evaluates capabilities from canonical active assignments', async () => {
    const repository = { findActiveForAccount: vi.fn().mockResolvedValue([{ role: 'safety_admin' }]) };
    const service = new AdminCapabilityAccessService(repository as never);
    await expect(service.hasCapability('a1', 'account.restrict')).resolves.toBe(true);
    await expect(service.hasCapability('a1', 'configuration.write')).resolves.toBe(false);
  });
});
