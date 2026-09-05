import { Injectable } from '@nestjs/common';
import { UserBlockRepository } from '../safety/user-block.repository.js';
import { DiscoveryExclusionPolicy } from './discovery-exclusion.policy.js';

@Injectable()
export class UserBlockDiscoveryExclusionPolicy extends DiscoveryExclusionPolicy {
  constructor(private readonly blocks: UserBlockRepository) {
    super();
  }

  async excludes(subjectAccountId: string, candidateAccountId: string): Promise<boolean> {
    if (await this.blocks.exists(subjectAccountId, candidateAccountId)) return true;
    return this.blocks.exists(candidateAccountId, subjectAccountId);
  }
}
