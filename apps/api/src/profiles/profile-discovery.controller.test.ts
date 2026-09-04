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
      ({ create: vi.fn().mockResolvedValue({ id:'viewer-1' }), update: vi.fn().mockResolvedValue({ id:'profile-1' }), completion: vi.fn().mockResolvedValue({ percentage: 50 }) } as never),
      ({ findById: vi.fn(), findByAccountId: vi.fn().mockResolvedValue({ id:'profile-1', accountId:'viewer-1', categoryId:'cat-1', fields:{displayName:'Satoshi'}, geographicScope:{kind:'global'} }) } as never),
      ({ discover: vi.fn().mockResolvedValue({ items:[], nextCursor:undefined }) } as never),
      ({ transition: vi.fn().mockResolvedValue({ state:'passed' }) } as never),
      ({ require: vi.fn().mockResolvedValue(undefined) } as never),
    );
  }

  it('uses the authenticated account as the profile owner, not request data', async () => {
    const c=controller(); const create=vi.spyOn((c as any).profiles,'create');
    await c.createMyProfile({ categoryId:'cat-1', fields:{ displayName:'Satoshi' } }, 'Bearer test');
    expect((create.mock.calls[0][0] as any).accountId).toBe('viewer-1');
  });

  it('updates metadata through a dedicated authenticated ownership boundary', async () => {
    const c=controller(); const update=vi.spyOn((c as any).profiles,'update');
    await c.updateMyProfileMetadata({
      avatar: { id:'media-1', storageKey:'avatars/1', status:'active' },
      biography: 'Updated bio',
    }, 'Bearer test');
    expect(update).toHaveBeenCalledWith('profile-1', expect.objectContaining({
      avatar: { id:'media-1', storageKey:'avatars/1', status:'active' },
      biography: 'Updated bio',
    }));
    expect((update.mock.calls[0][1] as any).verificationStatus).toBeUndefined();
  });

  it('derives completion only for the authenticated profile', async () => {
    const c=controller(); const completion=vi.spyOn((c as any).profiles,'completion');
    await c.getMyProfileCompletion('Bearer test');
    expect(completion).toHaveBeenCalledWith('profile-1',expect.objectContaining({ schema: expect.any(Object) }));
  });

  it('hydrates and updates only the authenticated account profile', async () => {
    const c=controller(); const repo=(c as any).profileRepository; const update=vi.spyOn((c as any).profiles,'update');
    await c.getMyProfile('Bearer test');
    expect(repo.findByAccountId).toHaveBeenCalledWith('viewer-1');
    await c.updateMyProfile({ fields:{ displayName:'Updated' }, biography:'New bio' },'Bearer test');
    expect(update).toHaveBeenCalledWith('profile-1',expect.objectContaining({ fields:{displayName:'Updated'}, biography:'New bio' }));
    expect((update.mock.calls[0][1] as any).verificationStatus).toBeUndefined();
  });

  it('forwards Phase 7 metadata only through the authenticated profile path', async () => {
    const c=controller(); const create=vi.spyOn((c as any).profiles,'create'); const update=vi.spyOn((c as any).profiles,'update');
    const avatar={ id:'media-1', storageKey:'avatars/1', status:'active' as const };
    const gallery=[{ id:'media-2', storageKey:'gallery/2', status:'pending' as const }];
    await c.createMyProfile({ categoryId:'cat-1', avatar, gallery, biography:'Hello', verificationStatus:'pending' }, 'Bearer test');
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ avatar, gallery, biography:'Hello', verificationStatus:'pending', accountId:'viewer-1' }));
    await c.updateMyProfile({ avatar:null, gallery, biography:'Updated' }, 'Bearer test');
    expect(update).toHaveBeenCalledWith('profile-1',expect.objectContaining({ avatar:null, gallery, biography:'Updated' }));
  });

  it('allows verification transitions only through moderation capability', async () => {
    const c=controller(); const update=vi.spyOn((c as any).profiles,'update'); const admin=(c as any).admin;
    await c.transitionVerification('target-1', { status:'verified' }, 'Bearer moderator');
    expect(admin.require).toHaveBeenCalledWith('viewer-1','manage-moderation');
    expect(update).toHaveBeenCalledWith('profile-1',{ verificationStatus:'verified' });
  });

  it('uses authenticated account as discovery subject and keeps projection server-owned', async () => {
    const c=controller(); const discover=vi.spyOn((c as any).discovery,'discover');
    await c.discover('cat-1','global',undefined,'10',undefined,'Bearer test');
    expect(discover.mock.calls[0][0] as any).toMatchObject({ subjectAccountId:'viewer-1', categoryId:'cat-1', limit:10 });
    expect((discover.mock.calls[0][0] as any).projectionPolicy).toEqual({ displayName:'public', headline:'public', bio:'public' });
  });

  it('uses authenticated account as match actor', async () => {
    const c=controller(); const transition=vi.spyOn((c as any).matches,'transition');
    await c.decide({ targetAccountId:'target-1', decision:'like', idempotencyKey:'key-1' }, 'Bearer test');
    expect(transition).toHaveBeenCalledWith(expect.objectContaining({ actorAccountId:'viewer-1', targetAccountId:'target-1', decision:'like', idempotencyKey:'key-1' }));
  });

  it('propagates authentication failure before accessing services', async () => {
    const resolver={ requireAuthenticated: vi.fn().mockRejectedValue(new UnauthorizedException()) };
    const c=new ProfileDiscoveryController(resolver as never, ({ list: vi.fn().mockResolvedValue([]) } as never), ({ schemaFor: vi.fn() } as never), {} as never, {} as never, {} as never, {} as never, {} as never);
    await expect(c.listCategories()).resolves.toBeDefined();
    await expect(c.getMyProfile()).rejects.toBeInstanceOf(UnauthorizedException);
  });
});