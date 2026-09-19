import { describe, expect, it } from 'vitest';
import { MATCHING_INTENTS, calculateMatchScore, type CandidateProfile, type IntentRequest } from './matching-intents';

describe('intent-first matching domain model', () => {
  it('exposes the six supported intent paths', () => {
    expect(MATCHING_INTENTS.map((intent) => intent.id)).toEqual(['meet', 'learn', 'work', 'create', 'help', 'join']);
  });

  it('scores intent, region, language, and a non-empty summary', () => {
    const request: IntentRequest = {
      intentId: 'work',
      title: 'Find a partner',
      summary: 'Looking for a product collaboration',
      region: 'Japan',
      language: 'Japanese',
    };
    const candidate: CandidateProfile = {
      id: 'candidate-1',
      name: 'Aki',
      intentIds: ['work', 'create'],
      region: 'Japan',
      languages: ['Japanese', 'English'],
      summary: 'Product collaboration and design',
      trustSignals: ['profile-complete'],
    };

    expect(calculateMatchScore(request, candidate)).toBe(100);
  });

  it('returns zero when no matching signals are present', () => {
    const request: IntentRequest = { intentId: 'learn', title: 'Learn', summary: '' };
    const candidate: CandidateProfile = {
      id: 'candidate-2',
      name: 'Ren',
      intentIds: ['join'],
      region: 'Canada',
      languages: ['English'],
      summary: '',
      trustSignals: [],
    };

    expect(calculateMatchScore(request, candidate)).toBe(0);
  });
});
