import type { DistanceConstraint } from './private-location.js';
import type { GeographicScope } from './geographic-scope.js';
import type { Profile } from './profile.js';

export type DiscoveryCursor = string;

export type DiscoveryQuery = Readonly<{
  subjectAccountId: string;
  categoryId: string;
  geographicScope: GeographicScope;
  limit: number;
  cursor?: DiscoveryCursor;
  distanceConstraint?: DistanceConstraint;
}>;

export type DiscoveryPage = Readonly<{
  items: readonly Profile[];
  nextCursor?: DiscoveryCursor;
}>;

export function createDiscoveryQuery(input: DiscoveryQuery): DiscoveryQuery {
  if (!input.subjectAccountId.trim()) throw new Error('Discovery subjectAccountId must not be empty');
  if (!input.categoryId.trim()) throw new Error('Discovery categoryId must not be empty');
  if (!Number.isInteger(input.limit) || input.limit < 1 || input.limit > 100) {
    throw new Error('Discovery limit must be an integer between 1 and 100');
  }
  if (input.cursor !== undefined && !input.cursor.trim()) throw new Error('Discovery cursor must not be empty');
  if (input.distanceConstraint) {
    if (!Number.isFinite(input.distanceConstraint.maxDistanceMeters) || input.distanceConstraint.maxDistanceMeters < 0) {
      throw new Error('Discovery maxDistanceMeters must be a finite non-negative number');
    }
  }
  return {
    ...input,
    geographicScope: { ...input.geographicScope } as GeographicScope,
    ...(input.distanceConstraint ? { distanceConstraint: { ...input.distanceConstraint } } : {}),
  };
}

export interface DiscoveryProfileRepository {
  discover(query: DiscoveryQuery): Promise<DiscoveryPage>;
}
