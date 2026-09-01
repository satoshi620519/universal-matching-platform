import { describe, expect, it } from 'vitest';
import { projectProfile } from './profile-projection.js';

const profile = {
  id: 'p1', accountId: 'owner', categoryId: 'dating',
  fields: { displayName: 'Satoshi', phone: 'secret', moderationNote: 'internal' },
  geographicScope: { kind: 'country', countryCode: 'JP' } as const,
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
});
