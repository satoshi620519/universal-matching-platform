export abstract class DiscoveryExclusionPolicy {
  abstract excludes(subjectAccountId: string, candidateAccountId: string): Promise<boolean>;
}

export class AllowAllDiscoveryExclusionPolicy extends DiscoveryExclusionPolicy {
  async excludes(): Promise<boolean> {
    return false;
  }
}

export type DiscoveryExclusionPolicies = Readonly<{
  block: DiscoveryExclusionPolicy;
  safety: DiscoveryExclusionPolicy;
}>;
