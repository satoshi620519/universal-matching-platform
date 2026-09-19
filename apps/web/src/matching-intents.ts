export type MatchingIntentId = 'meet' | 'learn' | 'work' | 'create' | 'help' | 'join';

export type MatchingIntent = {
  id: MatchingIntentId;
  label: string;
  title: string;
  description: string;
  examples: string[];
};

export type IntentRequest = {
  intentId: MatchingIntentId;
  title: string;
  summary: string;
  region?: string;
  language?: string;
  availability?: string;
};

export type CandidateProfile = {
  id: string;
  name: string;
  intentIds: MatchingIntentId[];
  region: string;
  languages: string[];
  summary: string;
  trustSignals?: string[];
};

export const MATCHING_INTENTS: readonly MatchingIntent[] = [
  { id: 'meet', label: 'Meet', title: '人と出会う', description: '恋愛・友だち・価値観の近い相手とつながる', examples: ['恋愛・パートナー', '友だち・仲間'] },
  { id: 'learn', label: 'Learn', title: '学ぶ・相談する', description: '知識や経験を持つ相手から学ぶ', examples: ['メンター', '語学・スキル'] },
  { id: 'work', label: 'Work', title: '仕事でつながる', description: '仕事・採用・協業の相手を見つける', examples: ['採用・人材', '業務パートナー'] },
  { id: 'create', label: 'Create', title: '一緒につくる', description: 'クリエイターやプロジェクト仲間と協働する', examples: ['共同制作', 'スタートアップ'] },
  { id: 'help', label: 'Help', title: '助け合う', description: 'サービス提供者や地域のサポートとつながる', examples: ['地域サービス', '相談・サポート'] },
  { id: 'join', label: 'Join', title: 'コミュニティに参加する', description: '関心や目的を共有するコミュニティを探す', examples: ['趣味・関心', '地域・イベント'] },
] as const;

export function calculateMatchScore(request: IntentRequest, candidate: CandidateProfile): number {
  let score = 0;
  if (candidate.intentIds.includes(request.intentId)) score += 55;
  if (request.region && candidate.region.toLowerCase() === request.region.toLowerCase()) score += 20;
  if (request.language && candidate.languages.some((language) => language.toLowerCase() === request.language?.toLowerCase())) score += 15;
  if (request.summary.trim().length > 0 && candidate.summary.trim().length > 0) score += 10;
  return Math.min(score, 100);
}
