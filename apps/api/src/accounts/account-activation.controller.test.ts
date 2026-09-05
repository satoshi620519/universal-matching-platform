import { describe, expect, it, vi } from 'vitest';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AccountActivationController } from './account-activation.controller.js';
import { AccountActivationService } from './account-activation.service.js';
import { AccountRepository } from './account.repository.js';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';

describe('account activation HTTP boundary', () => {
  const pending = {
    id: 'account-1',
    status: 'pending-onboarding' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  function controllerFor(
    account: typeof pending | null = pending,
    persisted: (Omit<typeof pending, 'status'> & { status: 'active' }) | null = {
      ...pending,
      status: 'active' as const,
    },
    principal: { accountId: string } = { accountId: 'account-1' },
  ) {
    const repository = {
      findById: async () => account,
      updateStatus: async (id: string, status: string) => {
        expect(id).toBe('account-1');
        expect(status).toBe('active');
        return persisted;
      },
    } as unknown as AccountRepository;
    const principalResolver = {
      requireAuthenticated: vi.fn().mockResolvedValue(principal),
    } as unknown as RequestPrincipalResolver;

    return new AccountActivationController(repository, new AccountActivationService(), principalResolver);
  }

  it('requires authentication before activation', async () => {
    const principalResolver = {
      requireAuthenticated: vi.fn().mockRejectedValue(new UnauthorizedException('authentication is required')),
    } as unknown as RequestPrincipalResolver;
    const repository = {
      findById: vi.fn(),
      updateStatus: vi.fn(),
    } as unknown as AccountRepository;
    const controller = new AccountActivationController(repository, new AccountActivationService(), principalResolver);

    await expect(controller.activate('account-1')).rejects.toBeInstanceOf(UnauthorizedException);
    expect(repository.findById).not.toHaveBeenCalled();
  });

  it('does not allow an authenticated principal to activate another account', async () => {
    const repository = {
      findById: vi.fn(),
      updateStatus: vi.fn(),
    } as unknown as AccountRepository;
    const principalResolver = {
      requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'other-account' }),
    } as unknown as RequestPrincipalResolver;
    const controller = new AccountActivationController(repository, new AccountActivationService(), principalResolver);

    await expect(controller.activate('account-1')).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findById).not.toHaveBeenCalled();
  });

  it('persists the legacy route activation state for the authenticated account', async () => {
    await expect(controllerFor().activate('account-1', 'Bearer session')).resolves.toEqual({
      accountId: 'account-1',
      state: 'active',
    });
  });

  it('rejects a missing account', async () => {
    await expect(controllerFor(null).activate('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects when the account disappears before persistence', async () => {
    await expect(controllerFor(pending, null).activate('account-1')).rejects.toBeInstanceOf(NotFoundException);
  });
});
