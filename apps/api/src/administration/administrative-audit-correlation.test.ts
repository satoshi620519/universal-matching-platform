import { describe, expect, it, vi } from 'vitest';
import { RoleAssignmentMutationService } from './role-assignment-mutation.service.js';
import { PrivilegedFailedEmailOutboxService } from './privileged-failed-email-outbox.service.js';

describe('administrative audit correlation propagation', () => {
  it('carries explicit correlation into a successful role mutation audit', async () => {
    const audit = { append: vi.fn() };
    const service = new RoleAssignmentMutationService({ assign: vi.fn() } as any, audit as any);
    await service.assign({ actorId: 'admin-1', accountId: 'account-1', role: 'moderator', correlationId: 'corr-role-1' });
    expect(audit.append).toHaveBeenCalledWith(expect.objectContaining({ correlationId: 'corr-role-1' }));
  });

  it('omits correlation for non-HTTP/operator invocation', async () => {
    const audit = { append: vi.fn() };
    const service = new RoleAssignmentMutationService({ assign: vi.fn() } as any, audit as any);
    await service.assign({ actorId: 'admin-1', accountId: 'account-1', role: 'moderator' });
    expect(audit.append).toHaveBeenCalledWith(expect.not.objectContaining({ correlationId: expect.anything() }));
  });

  it('carries correlation into successful privileged outbox audit only', async () => {
    const access = { require: vi.fn().mockResolvedValue(undefined) };
    const review = { requeue: vi.fn().mockResolvedValue(true), list: vi.fn() };
    const audit = { append: vi.fn() };
    const service = new PrivilegedFailedEmailOutboxService(access as any, review as any, audit as any);
    await service.requeue('admin-1', 'outbox-1', 'corr-outbox-1');
    expect(audit.append).toHaveBeenCalledWith(expect.objectContaining({ correlationId: 'corr-outbox-1' }));
  });
});
