export type GeographicScope =
  | Readonly<{ kind: 'global' }>
  | Readonly<{ kind: 'country'; countryCode: string }>
  | Readonly<{ kind: 'region'; countryCode: string; regionCode: string }>
  | Readonly<{ kind: 'city'; countryCode: string; regionCode: string; localityCode: string }>;

export function createGeographicScope(input: GeographicScope): GeographicScope {
  if (input.kind === 'global') return { kind: 'global' };
  const countryCode = input.countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(countryCode)) throw new Error('countryCode must be an ISO 3166-1 alpha-2 code');
  if (input.kind === 'country') return { kind: 'country', countryCode };
  const regionCode = input.regionCode.trim();
  if (!regionCode) throw new Error('regionCode must not be empty');
  if (input.kind === 'region') return { kind: 'region', countryCode, regionCode };
  const localityCode = input.localityCode.trim();
  if (!localityCode) throw new Error('localityCode must not be empty');
  return { kind: 'city', countryCode, regionCode, localityCode };
}
