import { Inject, Injectable, Optional } from '@nestjs/common';
import { blocksCapability, type SafetyRestriction } from '@universal/domain';
import { DiscoveryExclusionPolicy } from './discovery-exclusion.policy.js';
import { EffectiveSafetyRestrictionService } from '../safety/effective-safety-restriction.service.js';
import {
  createDiscoveryQuery, evaluateDiscoveryEligibility, projectProfile,
  type DiscoveryProfileRepository, type DistanceConstraint, type GeographicScope,
  type ProfileProjectionPolicy, type ProjectedProfile, type LocationPrecisionPolicy,
  matchesDiscoveryPreferences, matchesDiscoverySearch, type DiscoveryPreferences,
  type DiscoverySort, rankDiscoveryCandidates, type MatchingRulesConfiguration, type Profile,
} from '@universal/domain';

export type DiscoveryExclusionPolicies = Readonly<{ block: DiscoveryExclusionPolicy; safety: DiscoveryExclusionPolicy }>;

@Injectable()
export class DiscoveryService {
  constructor(
    @Inject('DISCOVERY_PROFILE_REPOSITORY') private readonly profiles: DiscoveryProfileRepository,
    @Inject('DISCOVERY_EXCLUSION_POLICIES') private readonly exclusions: DiscoveryExclusionPolicies,
    @Optional() private readonly effectiveSafety?: EffectiveSafetyRestrictionService,
  ) {}

  async discover(input: { subjectAccountId: string; categoryId: string; geographicScope: GeographicScope; limit: number; cursor?: string; distanceConstraint?: DistanceConstraint; projectionPolicy: ProfileProjectionPolicy; locationPolicy?: LocationPrecisionPolicy; preferences?: DiscoveryPreferences; sort?: DiscoverySort; search?: { term: string; fields: readonly string[] }; matchingRules?: MatchingRulesConfiguration; subjectProfile?: Profile }): Promise<{ items: readonly ProjectedProfile[]; nextCursor?: string }> {
    const query = createDiscoveryQuery(input);
    const page = await this.profiles.discover(query);
    const subjectCountryCode = input.geographicScope.kind === 'global' ? undefined : input.geographicScope.countryCode;
    const subjectRestriction: SafetyRestriction = this.effectiveSafety ? await this.effectiveSafety.resolveForAccount(input.subjectAccountId, 'general') : 'none';
    if (blocksCapability(subjectRestriction, 'general')) return { items: [] };

    const eligible = await Promise.all(page.items.map(async (candidate) => {
      if (!evaluateDiscoveryEligibility(input.subjectAccountId, input.categoryId, subjectCountryCode, candidate, input.geographicScope).eligible) return null;
      if (!matchesDiscoveryPreferences(candidate, query.preferences ?? { filters: [] })) return null;
      if (!matchesDiscoverySearch(candidate, query.search)) return null;
      if (await this.exclusions.block.excludes(input.subjectAccountId, candidate.accountId)) return null;
      if (await this.exclusions.safety.excludes(input.subjectAccountId, candidate.accountId)) return null;
      if (this.effectiveSafety) {
        const candidateRestriction = await this.effectiveSafety.resolveForAccount(candidate.accountId, 'general');
        if (blocksCapability(candidateRestriction, 'general')) return null;
      }
      return candidate;
    }));
    const candidates = eligible.filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null);
    const ordered = query.sort?.key === 'compatibilityScore' && input.subjectProfile && input.matchingRules
      ? rankDiscoveryCandidates(input.subjectProfile, candidates, input.matchingRules, query.sort).map((entry) => entry.profile)
      : candidates;
    const items = ordered.map((candidate) => projectProfile(candidate, { accountId: input.subjectAccountId }, input.projectionPolicy, {}, input.locationPolicy));
    return { items, ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}) };
  }
}
