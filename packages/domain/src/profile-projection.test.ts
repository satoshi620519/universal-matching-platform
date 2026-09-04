import { describe, expect, it } from 'vitest';
import { projectProfile } from './profile-projection.js';

const profile = {
  id: 'p1', accountId: 'owner', categoryId: 'dating',
  fields: { displayName: 'Satoshi', phone: 'secret', moderationNote: 'internal' },
  geographicScope: { kind: 'city', countryCode: 'JP', regionCode: '13', localityCode: '13101' } as const,
  avatar: { id: 'a1', storageKey: 'avatar/1', status: 'active' as const },
  gallery: [
    { id: 'g1', storageKey: 'gallery/1', status: 'active' as const },
    { id: 'g2', storageKey: 'gallery/2', status: 'pending' as const },
  ],
  biography: 'About me',
  verificationStatus: 'verified' as const,
};
const policy = { displayName: 'public', phone: 'owner', moderationNote: 'privileged' } as const;

describe('privacy-aware profile projection', () => {
  it('does not expose owner or privileged fields to another viewer', () => {
    const projected = projectProfile(profile, { accountId: 'other' }, policy);
    expect(projected.fields).toEqual({ displayName: 'Satoshi' });
    expect(projected).not.toHaveProperty('accountId');
  });

  it('exposes owner fields only to the profile owner', () => {
    expect(projectProfile(profile, { accountId: 'owner' }, policy).fields)
      .toEqual({ displayName: 'Satoshi', phone: 'secret' });
  });

  it('exposes privileged fields only with explicit privileged access', () => {
    expect(projectProfile(profile, { privileged: true }, policy).fields)
      .toEqual({ displayName: 'Satoshi', moderationNote: 'internal' });
  });

  it('fails closed for fields missing from the projection policy', () => {
    expect(projectProfile({ ...profile, fields: { ...profile.fields, unknown: 'hidden' } }, { accountId: 'other' }, policy).fields)
      .toEqual({ displayName: 'Satoshi' });
  });

  it('projects only active core media through explicit core policy', () => {
    const projected = projectProfile(profile, {}, policy, {
      avatar: 'public', gallery: 'public', verificationStatus: 'public',
    });
    expect(projected.avatar?.id).toBe('a1');
    expect(projected.gallery).toEqual([{ id: 'g1', storageKey: 'gallery/1', status: 'active' }]);
    expect(projected.verificationStatus).toBe('verified');
    expect(projected).not.toHaveProperty('biography');
  });

  it('fails closed for core metadata missing from policy', () => {
    const projected = projectProfile(profile, { accountId: 'other' }, policy);
    expect(projected).not.toHaveProperty('avatar');
    expect(projected).not.toHaveProperty('gallery');
    expect(projected).not.toHaveProperty('biography');
    expect(projected).not.toHaveProperty('verificationStatus');
  });

  it('defaults public location precision to country', () => {
    expect(projectProfile(profile, { accountId: 'other' }, policy).geographicScope)
      .toEqual({ kind: 'country', countryCode: 'JP' });
  });

  it('allows a deployment to expose region or city precision explicitly', () => {
    expect(projectProfile(profile, {}, policy, {}, { publicPrecision: 'region' }).geographicScope)
      .toEqual({ kind: 'region', countryCode: 'JP', regionCode: '13' });
    expect(projectProfile(profile, {}, policy, {}, { publicPrecision: 'city' }).geographicScope)
      .toEqual({ kind: 'city', countryCode: 'JP', regionCode: '13', localityCode: '13101' });
  });

  it('can suppress public location entirely', () => {
    expect(projectProfile(profile, {}, policy, {}, { publicPrecision: 'none' }))
      .not.toHaveProperty('geographicScope');
  });
});
