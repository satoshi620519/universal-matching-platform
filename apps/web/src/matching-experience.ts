import {
  calculateMatchScore,
  type CandidateProfile,
  type IntentRequest,
  type MatchingIntentId,
} from './matching-intents';

export type MatchReason = {
  label: string;
  detail: string;
};

export type RankedMatch = {
  candidate: CandidateProfile;
  score: number;
  reasons: MatchReason[];
};

export function buildMatchReasons(
  request: IntentRequest,
  candidate: CandidateProfile,
): MatchReason[] {
  const reasons: MatchReason[] = [];

  if (candidate.intentIds.includes(request.intentId)) {
    reasons.push({ label: '目的が一致', detail: '選択した目的に対応しています。' });
  }
  if (request.region && candidate.region.toLowerCase() === request.region.toLowerCase()) {
    reasons.push({ label: '地域が一致', detail: `${candidate.region}を拠点にしています。` });
  }
  if (
    request.language &&
    candidate.languages.some((language) => language.toLowerCase() === request.language?.toLowerCase())
  ) {
    reasons.push({ label: '言語が一致', detail: `${request.language}でやり取りできます。` });
  }
  if (request.summary.trim() && candidate.summary.trim()) {
    reasons.push({ label: 'プロフィール情報あり', detail: '目的や背景を比較できる情報があります。' });
  }

  return reasons;
}

export function rankCandidates(
  request: IntentRequest,
  candidates: CandidateProfile[],
): RankedMatch[] {
  return candidates
    .map((candidate) => ({
      candidate,
      score: calculateMatchScore(request, candidate),
      reasons: buildMatchReasons(request, candidate),
    }))
    .sort((left, right) => right.score - left.score);
}

export const DEMO_INTENT_REQUESTS: readonly IntentRequest[] = [
  {
    intentId: 'work' satisfies MatchingIntentId,
    title: '協業できるプロダクト仲間を探す',
    summary: 'プロダクト開発とデザインで協力できる相手を探しています。',
    region: 'Japan',
    language: 'Japanese',
  },
  {
    intentId: 'join' satisfies MatchingIntentId,
    title: '地域コミュニティに参加する',
    summary: '地域のイベントや趣味を共有できるコミュニティを探しています。',
    region: 'Japan',
    language: 'Japanese',
  },
];
