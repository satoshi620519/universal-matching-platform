import { describe, expect, it } from 'vitest';

import { calculateProfileCompletion } from './profile-completion.js';
import { createProfile, ProfileLimits } from './profile.js';

const profile = (overrides: Partial<Parameters<typeof createProfile>[0]> = {}) => createProfile({
  id: 'profile-1',
  accountId: 'account-1',
  categoryId: 'dating',
  fields: {},
  geographicScope: { countryCode: 'JP' } as any,
  avatar: null,
  gallery: [],
  biography: null,
  verificationStatus: 'unverified',
  ...overrides,
});

describe('Phase 7 profile core contracts', () => {
  it('normalizes biography and protects gallery bounds', () => {
    expect(profile({ biography: '  hello  ' }).biography).toBe('hello');
    expect(() => profile({ gallery: Array.from({ length: ProfileLimits.maxGalleryItems + 1 }, (_, index) => ({
      id: String(index), storageKey: `media/${index}`, status: 'active' as const,
    })) })).toThrow('Profile gallery must not exceed');
  });

  it('calculates deterministic completion without persisted counters', () => {
    const schema = { fields: [
      { key: 'display_name', label: 'Display name', type: 'text' as const, required: true, visibility: 'public' as const },
      { key: 'age', label: 'Age', type: 'number' as const, visibility: 'public' as const },
    ] };
    const result = calculateProfileCompletion(profile({ fields: { display_name: 'Satoshi' } }), schema, {
      requiredCore: ['avatar', 'biography', 'verification'],
    });
    expect(result).toEqual({
      completedRequiredCount: 1,
      totalRequiredCount: 4,
      percentage: 25,
      missingRequirementKeys: ['core:avatar', 'core:biography', 'core:verification'],
    });
  });

  it('counts active core metadata as complete', () => {
    const schema = { fields: [] };
    const result = calculateProfileCompletion(profile({
      avatar: { id: 'avatar-1', storageKey: 'avatars/1', status: 'active' },
      biography: 'Ready',
      verificationStatus: 'verified',
    }), schema, { requiredCore: ['avatar', 'biography', 'verification'] });
    expect(result.percentage).toBe(100);
    expect(result.missingRequirementKeys).toEqual([]);
  });
});
