import type { InteractionDecision, MatchState, MatchTransitionResult } from './match-transition.js';

export function resolveMatchTransition(
  actorDecision: InteractionDecision,
  reciprocalDecision?: InteractionDecision,
): MatchTransitionResult {
  const mutual = actorDecision === 'like' && reciprocalDecision === 'like';
  return { state: mutual ? 'matched' : 'pending', mutual, replayed: false };
}
