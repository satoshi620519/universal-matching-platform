import { describe, expect, it, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { ProfileDiscoveryController } from './profile-discovery.controller.js';

describe('ProfileDiscoveryController transport boundary', () => {
  const principalResolver = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId:'viewer-1', authenticationMethod:'test' }) };

  function controller(overrides: Record<string, unknown> = {}) {
    return new ProfileDiscoveryController(
      principalResolver as never,
      ({ list: vi.fn().mockResolvedValue([{ id:'cat-1' }]) } as never),
      ({ schemaFor: vi.fn().mockReturnValue({}) } as never),
      ({ create: vi.fn().mockResolvedValue({ id:'viewer-1' }) } as never),
      ({ findById: vi.fn(), findByAccountId: vi.fn().mockResolvedValue({ id:'profile-1', accountId:'viewer-1', categoryId:'cat-1', fields:{displayName:'Satoshi'}, geographicScope:{kind:'global'} }) } as never),
      ({ discover: vi.fn().mockResolvedValue({ items:[], nextCursor:undefined }) } as never),
      ({ transition: vi.fn().mockResolvedValue({ state:'passed' }) } as never),
    );
  }

  it('uses the authenticated account as the profile owner, not request data', async () => {
    const c=controller(); const create=vi.spyOn((c as any).profiles,'create');
    await c.createMyProfile({ categoryId:'cat-1', fields:{ displayName:'Satoshi' } }, 'Bearer test');
    expect((create.mock.calls[0][0] as any).accountId).toBe('viewer-1');
  });

  it('hydrates and updates only the authenticated account profile', async () => {
    const c=controller(); const repo=(c as any).profileRepository; const update=vi.spyOn((c as any).profiles,'update');
    await c.getMyProfile('Bearer test');
    expect(repo.findByAccountId).toHaveBeenCalledWith('viewer-1');
    await c.updateMyProfile({ fields:{ displayName:'Updated' } },'Bearer test');
    expect(update).toHaveBeenCalledWith('profile-1',expect.objectContaining({ fields:{displayName:'Updated'} }));
  });

  it('uses authenticated account as discovery subject and keeps projection server-owned', async () => {
    const c=controller(); const discover=vi.spyOn((c as any).discovery,'discover');
    await c.discover('cat-1','global',undefined,'10',undefined,'Bearer test');
    expect(discover.mock.calls[0][0] as any).toMatchObject({ subjectAccountId:'viewer-1', categoryId:'cat-1', limit:10 });
    expect(discover.mock.calls[0][0].projectionPolicy).toEqual({ displayName:'public', headline:'public', bio:'public' });
  });

  it('uses authenticated account as match actor', async () => {
    const c=controller(); const transition=vi.spyOn((c as any).matches,'transition');
    await c.decide({ targetAccountId:'target-1', decision:'like', idempotencyKey:'key-1' }, 'Bearer test');
    expect(transition).toHaveBeenCalledWith(expect.objectContaining({ actorAccountId:'viewer-1', targetAccountId:'target-1', decision:'like', idempotencyKey:'key-1' }));
  });

  it('propagates authentication failure before accessing services', async () => {
    const resolver={ requireAuthenticated: vi.fn().mockRejectedValue(new UnauthorizedException()) };
    const c=new ProfileDiscoveryController(resolver as never, {} as never, {} as never, {} as never, {} as never, {} as never, {} as never);
    await expect(c.listCategories()).resolves.toBeDefined();
    await expect(c.getMyProfile()).rejects.toBeInstanceOf(UnauthorizedException);
  });
});