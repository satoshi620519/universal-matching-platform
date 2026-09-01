import type { Profile } from './profile.js';

export type MatchDecisionKind = 'no_match' | 'eligible';

export type MatchDecision = Readonly<{
  kind: MatchDecisionKind;
  strategy: string;
  reason?: string;
}>;

export type MatchStrategyContext = Readonly<{
  subject: Profile;
  candidate: Profile;
}>;

export interface MatchStrategy {
  readonly key: string;
  decide(context: MatchStrategyContext): MatchDecision;
}

export function createMatchDecision(input: MatchDecision): MatchDecision {
  if (!input.strategy.trim()) throw new Error('Match decision strategy must not be empty');
  if (input.kind === 'no_match' && input.reason !== undefined && !input.reason.trim()) {
    throw new Error('Match decision reason must not be empty when supplied');
  }
  return { ...input };
}
