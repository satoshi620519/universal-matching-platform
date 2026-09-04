export abstract class DiscoveryExclusionPolicy {
  abstract excludes(subjectAccountId: string, candidateAccountId: string): Promise<boolean>;
}

export class AllowAllDiscoveryExclusionPolicy extends DiscoveryExclusionPolicy {
  async excludes(_subjectAccountId: string, _candidateAccountId: string): Promise<boolean> {
    return false;
  }
}
