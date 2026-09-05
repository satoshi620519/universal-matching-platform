export interface UserBlock {
  readonly blockerAccountId: string;
  readonly blockedAccountId: string;
  readonly createdAt: string;
}

export interface CreateUserBlockInput {
  readonly blockerAccountId: string;
  readonly blockedAccountId: string;
}

export function createUserBlock(input: CreateUserBlockInput, createdAt = new Date().toISOString()): UserBlock {
  const blockerAccountId = input.blockerAccountId.trim();
  const blockedAccountId = input.blockedAccountId.trim();
  if (!blockerAccountId || !blockedAccountId) throw new Error('block account ids are required');
  if (blockerAccountId === blockedAccountId) throw new Error('an account cannot block itself');
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) throw new Error('createdAt is invalid');
  return { blockerAccountId, blockedAccountId, createdAt: created.toISOString() };
}
