import { describe, expect, it, vi } from 'vitest';
import { RoleAssignmentMutationService } from './role-assignment-mutation.service.js';

describe('RoleAssignmentMutationService', () => {
  it('persists assigning authority and appends an audit record', async () => {
    const assignments = { assign: vi.fn(), revokeActive: vi.fn() };
    const audit = { append: vi.fn() };
    const service = new RoleAssignmentMutationService(assignments as any, audit as any);
    const at = new Date('2026-09-01T00:00:00.000Z');
    await service.assign({ actorId: 'admin-1', accountId: 'account-1', role: 'moderator', effectiveAt: at });
    expect(assignments.assign).toHaveBeenCalledWith(expect.objectContaining({ accountId: 'account-1', role: 'moderator', assignedByAccountId: 'admin-1', effectiveAt: at }));
    expect(audit.append).toHaveBeenCalledWith(expect.objectContaining({ actorId: 'admin-1', action: 'assign-administrative-role', targetId: 'account-1' }));
  });

  it('does not append a revocation audit record when nothing changed', async () => {
    const assignments = { assign: vi.fn(), revokeActive: vi.fn().mockResolvedValue(0) };
    const audit = { append: vi.fn() };
    const service = new RoleAssignmentMutationService(assignments as any, audit as any);
    await expect(service.revoke({ actorId: 'admin-1', accountId: 'account-1', role: 'moderator' })).resolves.toBe(false);
    expect(audit.append).not.toHaveBeenCalled();
  });

  it('rejects invalid effective windows before mutation', async () => {
    const service = new RoleAssignmentMutationService({ assign: vi.fn() } as any, { append: vi.fn() } as any);
    const at = new Date('2026-09-01T00:00:00.000Z');
    await expect(service.assign({ actorId: 'admin-1', accountId: 'account-1', role: 'moderator', effectiveAt: at, expiresAt: at })).rejects.toThrow('expiresAt must be after effectiveAt');
  });
});
