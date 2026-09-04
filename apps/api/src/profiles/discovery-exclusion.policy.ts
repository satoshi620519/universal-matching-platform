import type { InjectionToken } from '@nestjs/common';

export abstract class DiscoveryExclusionPolicy {
  abstract excludes(subjectAccountId: string, candidateAccountId: string): Promise<boolean>;
}

export const BLOCK_DISCOVERY_EXCLUSION_POLICY: InjectionToken = Symbol('BLOCK_DISCOVERY_EXCLUSION_POLICY');
export const SAFETY_DISCOVERY_EXCLUSION_POLICY: InjectionToken = Symbol('SAFETY_DISCOVERY_EXCLUSION_POLICY');

export class AllowAllDiscoveryExclusionPolicy extends DiscoveryExclusionPolicy {
  async excludes(_subjectAccountId: string, _candidateAccountId: string): Promise<boolean> {
    return false;
  }
}

export type DiscoveryExclusionPolicies = Readonly<{
  block: DiscoveryExclusionPolicy;
  safety: DiscoveryExclusionPolicy;
}>;
