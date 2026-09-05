export const DISCOVERY_SORT_KEYS = ['id', 'compatibilityScore'] as const;

export type DiscoverySortKey = typeof DISCOVERY_SORT_KEYS[number];
export type DiscoverySortDirection = 'asc' | 'desc';

export type DiscoverySort = Readonly<{
  key: DiscoverySortKey;
  direction: DiscoverySortDirection;
}>;

export const DEFAULT_DISCOVERY_SORT: DiscoverySort = Object.freeze({
  key: 'id',
  direction: 'asc',
});

export function createDiscoverySort(input: DiscoverySort = DEFAULT_DISCOVERY_SORT): DiscoverySort {
  if (!DISCOVERY_SORT_KEYS.includes(input.key)) throw new Error('discovery sort key is invalid');
  if (input.direction !== 'asc' && input.direction !== 'desc') throw new Error('discovery sort direction is invalid');
  return { ...input };
}
