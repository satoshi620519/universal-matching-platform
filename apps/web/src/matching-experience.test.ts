import { describe, expect, it } from 'vitest';
import { buildMatchReasons, getDemoMatchCards, getDemoMatches, rankCandidates } from './matching-experience';
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

  it('uses a stable candidate-id tie breaker', () => {
    const tied: CandidateProfile[] = [
      { ...candidates[0], id: 'zulu' },
      { ...candidates[0], id: 'alpha' },
    ];
    expect(rankCandidates({ ...request, intentId: 'learn', summary: '' }, tied).map((item) => item.candidate.id)).toEqual(['alpha', 'zulu']);
  });

  it('returns the reusable demo dataset in ranked order', () => {
    const ranked = getDemoMatches(request);
    expect(ranked[0].candidate.id).toBe('alex');
    expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
    expect(ranked[0].reasons.map((reason) => reason.label)).toContain('目的が一致');
  });

  it('converts ranked demo matches into UI-ready cards', () => {
    const cards = getDemoMatchCards(request);
    expect(cards[0]).toMatchObject({ id: 'alex', name: 'Alex', score: 100 });
    expect(cards[0].summary).toContain('起業家');
    expect(cards[0].reasons.length).toBeGreaterThan(0);
  });
});
