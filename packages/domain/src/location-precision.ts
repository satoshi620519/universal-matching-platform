import type { GeographicScope } from './geographic-scope.js';

export type LocationPrecision = 'none' | 'country' | 'region' | 'city';

export type LocationPrecisionPolicy = Readonly<{
  publicPrecision: LocationPrecision;
}>;

export const defaultLocationPrecisionPolicy: LocationPrecisionPolicy = Object.freeze({
  publicPrecision: 'country',
});

export function projectGeographicScope(
  scope: GeographicScope,
  policy: LocationPrecisionPolicy,
): GeographicScope | undefined {
  switch (policy.publicPrecision) {
    case 'none':
      return undefined;
    case 'country':
      return scope.kind === 'global'
        ? scope
        : { kind: 'country', countryCode: scope.countryCode };
    case 'region':
      if (scope.kind === 'global' || scope.kind === 'country') return scope;
      return { kind: 'region', countryCode: scope.countryCode, regionCode: scope.regionCode };
    case 'city':
      return scope;
  }
}

export function validateLocationPrecisionPolicy(policy: LocationPrecisionPolicy): void {
  if (!['none', 'country', 'region', 'city'].includes(policy.publicPrecision)) {
    throw new Error('publicPrecision must be one of none, country, region, city');
  }
}
