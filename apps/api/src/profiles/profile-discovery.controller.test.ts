import { describe, expect, it, vi } from 'vitest';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ProfileDiscoveryController } from './profile-discovery.controller.js';

describe('ProfileDiscoveryController transport boundary', () => {
  const principalResolver = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId:'viewer-1', authenticationMethod:'test' }) };

  function controller(overrides: Record<string, unknown> = {}) {
    return new ProfileDiscoveryController(
      principalResolver as never,
      ({ list: vi.fn().mockResolvedValue([{ id:'cat-1', key:'freelance' }, { id:'dating', key:'dating' }]) } as never),
      ({ schemaFor: vi.fn().mockReturnValue({ displayName:{ kind:'string', visibility:'public' }, headline:{ kind:'string', visibility:'public' }, bio:{ kind:'string', visibility:'public' } }) } as never),
      ({ create: vi.fn().mockResolvedValue({ id:'viewer-1' }), update: vi.fn().mockResolvedValue({ id:'profile-1' }), completion: vi.fn().mockResolvedValue({ percentage: 50 }) } as never),
      ({ findById: vi.fn(), findByAccountId: vi.fn().mockResolvedValue({ id:'profile-1', accountId:'viewer-1', categoryId:'cat-1', fields:{displayName:'Satoshi'}, geographicScope:{kind:'global'} }) } as never),
      ({ discover: vi.fn().mockResolvedValue({ items:[], nextCursor:undefined }) } as never),
      ({ transition: vi.fn().mockResolvedValue({ state:'passed' }) } as never),
      ({ require: vi.fn().mockResolvedValue(undefined), can: vi.fn().mockResolvedValue(false) } as never),
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

  it('maps a missing authenticated profile to HTTP 404', async () => {
    const c=controller();
    vi.spyOn((c as any).profileRepository,'findByAccountId').mockResolvedValue(null);
    await expect(c.getMyProfileCompletion('Bearer test')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects completion lookup when the persisted profile category no longer exists', async () => {
    const c=controller();
    vi.spyOn((c as any).profileRepository,'findByAccountId').mockResolvedValue({ id:'p1', categoryId:'missing' });
    vi.spyOn((c as any).categories,'list').mockResolvedValue([]);
    await expect(c.getMyProfileCompletion('Bearer test')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects profile creation for an unknown category instead of validating against the base schema', async () => {
    const c=controller();
    vi.spyOn((c as any).categories,'list').mockResolvedValue([]);
    await expect(c.createMyProfile({ categoryId:'unknown', fields:{} }, 'Bearer test')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('maps GET of a missing authenticated profile to HTTP 404', async () => {
    const c=controller();
    vi.spyOn((c as any).profileRepository,'findByAccountId').mockResolvedValue(null);
    await expect(c.getMyProfile('Bearer test')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('validates existing fields against the new category schema on a category-only change', async () => {
    const c=controller();
    const repo=(c as any).profileRepository;
    vi.spyOn(repo,'findByAccountId').mockResolvedValue({ id:'p1', accountId:'viewer-1', categoryId:'cat-1', fields:{ displayName:'Satoshi' } });
    vi.spyOn((c as any).categories,'list').mockResolvedValue([{ id:'cat-2', key:'freelance' }]);
    const schemaFor=vi.spyOn((c as any).schemas,'schemaFor').mockReturnValue({ displayName:{ kind:'string', required:true }, skills:{ kind:'string', required:true } });
    const update=vi.spyOn((c as any).profiles,'update').mockResolvedValue({} as never);
    await c.updateMyProfile({ categoryId:'cat-2' },'Bearer test');
    expect(schemaFor).toHaveBeenCalledWith('freelance');
    expect(update).toHaveBeenCalledWith('p1',expect.objectContaining({ categoryId:'cat-2', fieldSchema:expect.any(Object) }));
  });

  it('projects only active public core metadata for another account', async () => {
    const c=controller();
    vi.spyOn((c as any).profileRepository,'findByAccountId').mockResolvedValue({
      id:'p1', accountId:'target', categoryId:'dating', fields:{ displayName:'Visible', secret:'Hidden' },
      geographicScope:{ kind:'global' }, avatar:{ id:'a1', storageKey:'a', status:'active' },
      gallery:[{ id:'g1', storageKey:'g1', status:'active' },{ id:'g2', storageKey:'g2', status:'pending' }],
      biography:'About', verificationStatus:'verified'
    });
    await expect(c.getPublicProfile('target','Bearer test')).resolves.toEqual(expect.objectContaining({
      fields:{ displayName:'Visible' }, avatar:expect.objectContaining({id:'a1'}), gallery:[expect.objectContaining({id:'g1'})],
      biography:'About', verificationStatus:'verified'
    }));
  });

  it('passes the authenticated viewer identity to public profile projection', async () => {
    const c=controller();
    vi.spyOn((c as any).profileRepository,'findByAccountId').mockResolvedValue({ accountId:'target', categoryId:'cat-1', fields:{ displayName:'Visible' } });
    await c.getPublicProfile('target','Bearer test');
    expect((c as any).profileRepository.findByAccountId).toHaveBeenCalledWith('target');
  });

  it('passes privileged viewer capability into domain privacy projection', async () => {
    const c=controller();
    const admin=(c as any).admin;
    vi.spyOn(admin,'can').mockResolvedValue(true);
    vi.spyOn((c as any).profileRepository,'findByAccountId').mockResolvedValue({ id:'p1', accountId:'target', categoryId:'dating', fields:{ moderationNote:'internal' }, geographicScope:{kind:'global'} });
    await c.getPublicProfile('target','Bearer moderator');
    expect(admin.can).toHaveBeenCalledWith('viewer-1','manage-moderation');
  });

  it('projects only public fields when viewing another account profile', async () => {
    const c=controller();
    vi.spyOn((c as any).profileRepository,'findByAccountId').mockResolvedValue({ accountId:'target', categoryId:'cat-1', fields:{ displayName:'Visible', secret:'Hidden' } });
    await expect(c.getPublicProfile('target','Bearer test')).resolves.toEqual(expect.objectContaining({ fields:{ displayName:'Visible' } }));
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
    await c.createMyProfile({ categoryId:'cat-1', avatar, gallery, biography:'Hello' }, 'Bearer test');
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ avatar, gallery, biography:'Hello', accountId:'viewer-1' }));
    expect((create.mock.calls[0][0] as any).verificationStatus).toBeUndefined();
    await c.updateMyProfile({ avatar:null, gallery, biography:'Updated' }, 'Bearer test');
    expect(update).toHaveBeenCalledWith('profile-1',expect.objectContaining({ avatar:null, gallery, biography:'Updated' }));
  });

  it('allows verification transitions only through moderation capability', async () => {
    const c=controller(); const update=vi.spyOn((c as any).profiles,'update'); const admin=(c as any).admin;
    await c.transitionVerification('target-1', { status:'verified' }, 'Bearer moderator');
    expect(admin.require).toHaveBeenCalledWith('viewer-1','manage-moderation');
    expect(update).toHaveBeenCalledWith('profile-1',{ verificationStatus:'verified' });
  });

  it('derives completion requirements from the configured category schema even for missing optional fields', async () => {
    const c=controller();
    vi.spyOn((c as any).profileRepository,'findByAccountId').mockResolvedValue({ id:'p1', accountId:'viewer-1', categoryId:'cat-1', fields:{ displayName:'Satoshi' } });
    vi.spyOn((c as any).categories,'list').mockResolvedValue([{ id:'cat-1', key:'freelance' }]);
    vi.spyOn((c as any).schemas,'schemaFor').mockReturnValue({ displayName:{ kind:'string', required:true }, skills:{ kind:'string', required:true } });
    const completion=vi.spyOn((c as any).profiles,'completion').mockResolvedValue({ percentage:50 });
    await c.getMyProfileCompletion('Bearer test');
    expect(completion).toHaveBeenCalledWith('p1', expect.objectContaining({ schema: expect.objectContaining({ fields: expect.arrayContaining([expect.objectContaining({ key:'skills', required:true })]) }) }));
  });

  it('exposes city hierarchy and distance constraint through discovery transport', async () => {
    const c=controller(); const discover=vi.spyOn((c as any).discovery,'discover');
    await c.discover('cat-1','city','JP','13','13101','10',undefined,'2500','Bearer test');
    expect(discover.mock.calls[0][0] as any).toMatchObject({
      categoryId:'cat-1',
      geographicScope:{ kind:'city', countryCode:'JP', regionCode:'13', localityCode:'13101' },
      distanceConstraint:{ maxDistanceMeters:2500 },
    });
  });

  it('uses authenticated account as discovery subject and keeps projection server-owned', async () => {
    const c=controller(); const discover=vi.spyOn((c as any).discovery,'discover');
    await c.discover('cat-1','global',undefined,undefined,undefined,'10',undefined,undefined,'Bearer test');
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
