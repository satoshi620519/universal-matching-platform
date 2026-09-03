export type TerminologyKey =
  | 'user'
  | 'profile'
  | 'discovery'
  | 'match'
  | 'matches'
  | 'message'
  | 'messages';

export interface TerminologyConfiguration {
  terms: Partial<Record<TerminologyKey, string>>;
}

export function normalizeTerminologyConfiguration(
  value: TerminologyConfiguration | undefined,
): TerminologyConfiguration | undefined {
  if (!value) return undefined;
  const terms = Object.fromEntries(
    Object.entries(value.terms)
      .filter(([key, label]) => typeof key === 'string' && typeof label === 'string' && label.trim().length > 0)
      .map(([key, label]) => [key, label.trim()]),
  ) as Partial<Record<TerminologyKey, string>>;
  return Object.keys(terms).length ? { terms } : undefined;
}

export function terminologyLabel(
  configuration: TerminologyConfiguration | undefined,
  key: TerminologyKey,
  fallback: string,
): string {
  return configuration?.terms[key]?.trim() || fallback;
}
