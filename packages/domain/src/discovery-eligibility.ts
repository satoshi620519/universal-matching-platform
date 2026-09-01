import type { Profile } from './profile.js';

export type DiscoveryEligibility = Readonly<{
  candidate: Profile;
  eligible: boolean;
  reason?: 'self' | 'category' | 'geography';
}>;

export function evaluateDiscoveryEligibility(
  subjectAccountId: string,
  categoryId: string,
  subjectCountryCode: string | undefined,
  candidate: Profile,
): DiscoveryEligibility {
  if (candidate.accountId === subjectAccountId) return { candidate, eligible: false, reason: 'self' };
  if (candidate.categoryId !== categoryId) return { candidate, eligible: false, reason: 'category' };
  const scope = candidate.geographicScope;
  if (scope.kind !== 'global' && (!subjectCountryCode || scope.countryCode !== subjectCountryCode)) {
    return { candidate, eligible: false, reason: 'geography' };
  }
  return { candidate, eligible: true };
}
