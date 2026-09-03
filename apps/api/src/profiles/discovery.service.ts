import { Injectable, Optional } from '@nestjs/common';
import { blocksCapability, type SafetyRestriction } from '@universal/domain';
import { DiscoveryExclusionPolicy } from './discovery-exclusion.policy.js';
import { EffectiveSafetyRestrictionService } from '../safety/effective-safety-restriction.service.js';
import {
  createDiscoveryQuery,
  evaluateDiscoveryEligibility,
  projectProfile,
  type DiscoveryProfileRepository,
  type GeographicScope,
  type ProfileProjectionPolicy,
  type ProjectedProfile,
} from '@universal/domain';

@Injectable()
export class DiscoveryService {
  constructor(
    private readonly profiles: DiscoveryProfileRepository,
    private readonly blockExclusions: DiscoveryExclusionPolicy,
    private readonly safetyExclusions: DiscoveryExclusionPolicy,
    @Optional() private readonly effectiveSafety?: EffectiveSafetyRestrictionService,
  ) {}

  async discover(input: { subjectAccountId: string; categoryId: string; geographicScope: GeographicScope; limit: number; cursor?: string; projectionPolicy: ProfileProjectionPolicy }): Promise<{ items: readonly ProjectedProfile[]; nextCursor?: string }> {
    const query = createDiscoveryQuery(input);
    const page = await this.profiles.discover(query);
    const subjectCountryCode = input.geographicScope.kind === 'global' ? undefined : input.geographicScope.countryCode;
    const subjectRestriction: SafetyRestriction = this.effectiveSafety ? await this.effectiveSafety.resolveForAccount(input.subjectAccountId, 'general') : 'none';
    if (blocksCapability(subjectRestriction, 'general')) return { items: [] };

    const eligible = await Promise.all(page.items.map(async (candidate) => {
      if (!evaluateDiscoveryEligibility(input.subjectAccountId, input.categoryId, subjectCountryCode, candidate).eligible) return null;
      if (await this.blockExclusions.excludes(input.subjectAccountId, candidate.accountId)) return null;
      if (await this.safetyExclusions.excludes(input.subjectAccountId, candidate.accountId)) return null;
      if (this.effectiveSafety) {
        const candidateRestriction = await this.effectiveSafety.resolveForAccount(candidate.accountId, 'general');
        if (blocksCapability(candidateRestriction, 'general')) return null;
      }
      return candidate;
    }));
    const items = eligible.filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null).map((candidate) => projectProfile(candidate, { accountId: input.subjectAccountId }, input.projectionPolicy));
    return { items, ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}) };
  }
}
