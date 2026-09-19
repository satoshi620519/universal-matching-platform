import { describe, expect, it } from 'vitest';
import { buildMatchReasons, rankCandidates } from './matching-experience';
import type { CandidateProfile, IntentRequest } from './matching-intents';

const request: IntentRequest = {
  intentId: 'work',
  title: '協業相手を探す',
  summary: 'プロダクト開発で協力できる相手を探しています。',
  region: 'Japan',
  language: 'Japanese',
};

const candidates: CandidateProfile[] = [
  {
    id: 'low',
    name: 'Low',
    intentIds: ['join'],
    region: 'Canada',
    languages: ['English'],
    summary: 'Community events',
  },
  {
    id: 'high',
    name: 'High',
    intentIds: ['work'],
    region: 'Japan',
    languages: ['Japanese'],
    summary: 'Product collaboration',
  },
];

describe('matching experience helpers', () => {
  it('ranks candidates by descending score', () => {
    const ranked = rankCandidates(request, candidates);
    expect(ranked.map((item) => item.candidate.id)).toEqual(['high', 'low']);
    expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
  });

  it('returns transparent reasons for matching signals', () => {
    const reasons = buildMatchReasons(request, candidates[1]);
    expect(reasons.map((reason) => reason.label)).toEqual([
      '目的が一致',
      '地域が一致',
      '言語が一致',
      'プロフィール情報あり',
    ]);
  });
});
