import type { MatchingRulesConfiguration } from './matching-rules-configuration.js';
import { evaluateRuleBasedCompatibility } from './match-compatibility.js';
import type { Profile } from './profile.js';
import type { DiscoverySort } from './discovery-sorting.js';

export type RankedDiscoveryCandidate = Readonly<{ profile: Profile; compatibilityScore: number }>;

export function rankDiscoveryCandidates(
  subject: Profile,
  candidates: readonly Profile[],
  configuration: MatchingRulesConfiguration,
  sort: DiscoverySort,
): readonly RankedDiscoveryCandidate[] {
  const ranked = candidates.map((profile) => ({
    profile,
    compatibilityScore: evaluateRuleBasedCompatibility(subject, profile, configuration).score,
  }));
  if (sort.key === 'compatibilityScore') {
    const direction = sort.direction === 'asc' ? 1 : -1;
    return ranked.sort((a, b) => direction * (a.compatibilityScore - b.compatibilityScore) || a.profile.id.localeCompare(b.profile.id));
  }
  return ranked.sort((a, b) => {
    const direction = sort.direction === 'asc' ? 1 : -1;
    return direction * a.profile.id.localeCompare(b.profile.id);
  });
}
