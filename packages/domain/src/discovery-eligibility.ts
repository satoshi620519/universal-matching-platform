import type { GeographicScope } from './geographic-scope.js';
import type { Profile } from './profile.js';

export type DiscoveryEligibility = Readonly<{
  candidate: Profile;
  eligible: boolean;
  reason?: 'self' | 'category' | 'geography';
}>;

function geographicScopeMatches(subject: GeographicScope, candidate: GeographicScope): boolean {
  if (candidate.kind === 'global' || subject.kind === 'global') return true;
  if (candidate.countryCode !== subject.countryCode) return false;
  if (candidate.kind === 'country' || subject.kind === 'country') return true;
  if (candidate.regionCode !== subject.regionCode) return false;
  if (candidate.kind === 'region' || subject.kind === 'region') return true;
  return candidate.localityCode === subject.localityCode;
}

export function evaluateDiscoveryEligibility(
  subjectAccountId: string,
  categoryId: string,
  subjectCountryCode: string | undefined,
  candidate: Profile,
  subjectGeographicScope?: GeographicScope,
): DiscoveryEligibility {
  if (candidate.accountId === subjectAccountId) return { candidate, eligible: false, reason: 'self' };
  if (candidate.categoryId !== categoryId) return { candidate, eligible: false, reason: 'category' };
  if (subjectGeographicScope) {
    if (!geographicScopeMatches(subjectGeographicScope, candidate.geographicScope)) {
      return { candidate, eligible: false, reason: 'geography' };
    }
  } else {
    const scope = candidate.geographicScope;
    if (scope.kind !== 'global' && (!subjectCountryCode || scope.countryCode !== subjectCountryCode)) {
      return { candidate, eligible: false, reason: 'geography' };
    }
  }
  return { candidate, eligible: true };
}
