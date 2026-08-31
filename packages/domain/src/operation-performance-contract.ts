export type CriticalUserJourney =
  | 'authentication'
  | 'onboarding-progression'
  | 'discovery-retrieval'
  | 'matching-action'
  | 'message-sending'
  | 'protected-capability-check';

export type LatencyDimension =
  | 'client'
  | 'api'
  | 'database'
  | 'third-party';

export interface PerformanceTarget {
  readonly journey: CriticalUserJourney;
  readonly targetMilliseconds: number;
  readonly measuredDimensions: readonly LatencyDimension[];
}

export function hasValidPerformanceTarget(
  target: PerformanceTarget,
): boolean {
  return (
    Number.isFinite(target.targetMilliseconds) &&
    target.targetMilliseconds > 0 &&
    target.measuredDimensions.length > 0 &&
    new Set(target.measuredDimensions).size === target.measuredDimensions.length
  );
}

export function coversCriticalPerformanceJourneys(
  targets: readonly PerformanceTarget[],
): boolean {
  const covered = new Set(targets.map((target) => target.journey));
  const required: readonly CriticalUserJourney[] = [
    'authentication',
    'onboarding-progression',
    'discovery-retrieval',
    'matching-action',
    'message-sending',
    'protected-capability-check',
  ];

  return required.every((journey) => covered.has(journey));
}
