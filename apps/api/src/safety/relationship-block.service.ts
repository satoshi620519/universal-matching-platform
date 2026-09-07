import { BadRequestException, Injectable } from '@nestjs/common';
import { RelationshipBlockRepository } from './relationship-block.repository.js';

@Injectable()
export class RelationshipBlockService {
  constructor(private readonly blocks: RelationshipBlockRepository) {}
  async block(input: { blockerAccountId: string; blockedAccountId: string }) {
    if (input.blockerAccountId === input.blockedAccountId) throw new BadRequestException('An account cannot block itself.');
    return this.blocks.create(input.blockerAccountId, input.blockedAccountId);
  }
  async isBlockedBetween(firstAccountId: string, secondAccountId: string) {
    if (firstAccountId === secondAccountId) return false;
    return this.blocks.existsBetween(firstAccountId, secondAccountId);
  }
}
