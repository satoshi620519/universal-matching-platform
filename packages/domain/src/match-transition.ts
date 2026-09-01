export type InteractionDecision = 'like' | 'pass';
export type MatchState = 'pending' | 'matched';

export type MatchTransitionCommand = Readonly<{
  actorAccountId: string;
  targetAccountId: string;
  decision: InteractionDecision;
  idempotencyKey: string;
}>;

export type MatchTransitionResult = Readonly<{
  state: MatchState;
  mutual: boolean;
  replayed: boolean;
}>;

export interface MatchTransitionRepository {
  transition(command: MatchTransitionCommand): Promise<MatchTransitionResult>;
}

export function createMatchTransitionCommand(input: MatchTransitionCommand): MatchTransitionCommand {
  if (!input.actorAccountId.trim()) throw new Error('Match transition actorAccountId must not be empty');
  if (!input.targetAccountId.trim()) throw new Error('Match transition targetAccountId must not be empty');
  if (input.actorAccountId === input.targetAccountId) throw new Error('Match transition cannot target self');
  if (!input.idempotencyKey.trim()) throw new Error('Match transition idempotencyKey must not be empty');
  return { ...input };
}
