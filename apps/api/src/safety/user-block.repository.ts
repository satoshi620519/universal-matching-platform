import type { UserBlock } from '@universal/domain';

export abstract class UserBlockRepository {
  abstract create(blockerAccountId: string, blockedAccountId: string, createdAt?: Date): Promise<UserBlock>;
  abstract remove(blockerAccountId: string, blockedAccountId: string): Promise<boolean>;
  abstract exists(blockerAccountId: string, blockedAccountId: string): Promise<boolean>;
}
