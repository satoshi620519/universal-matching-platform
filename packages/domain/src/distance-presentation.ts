export type DistanceUnit = 'metric' | 'imperial';

export interface DistancePresentationPolicy {
  readonly unit: DistanceUnit;
}

export const defaultDistancePresentationPolicy: DistancePresentationPolicy = Object.freeze({
  unit: 'metric',
});

export function validateDistancePresentationPolicy(policy: DistancePresentationPolicy): void {
  if (policy.unit !== 'metric' && policy.unit !== 'imperial') {
    throw new Error('distance unit must be metric or imperial');
  }
}

export function convertDistanceMeters(
  meters: number,
  policy: DistancePresentationPolicy = defaultDistancePresentationPolicy,
): number {
  if (!Number.isFinite(meters) || meters < 0) throw new Error('distance meters must be a finite non-negative number');
  validateDistancePresentationPolicy(policy);
  return policy.unit === 'metric' ? meters / 1000 : meters / 1609.344;
}
