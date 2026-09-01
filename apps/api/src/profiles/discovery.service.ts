import { Injectable } from '@nestjs/common';
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
  constructor(private readonly profiles: DiscoveryProfileRepository) {}

  async discover(input: {
    subjectAccountId: string;
    categoryId: string;
    geographicScope: GeographicScope;
    limit: number;
    cursor?: string;
    projectionPolicy: ProfileProjectionPolicy;
  }): Promise<{ items: readonly ProjectedProfile[]; nextCursor?: string }> {
    const query = createDiscoveryQuery(input);
    const page = await this.profiles.discover(query);
    const subjectCountryCode = input.geographicScope.kind === 'global'
      ? undefined
      : input.geographicScope.countryCode;

    const items = page.items
      .filter((candidate) => evaluateDiscoveryEligibility(
        input.subjectAccountId, input.categoryId, subjectCountryCode, candidate,
      ).eligible)
      .map((candidate) => projectProfile(
        candidate,
        { accountId: input.subjectAccountId },
        input.projectionPolicy,
      ));

    return { items, ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}) };
  }
}
