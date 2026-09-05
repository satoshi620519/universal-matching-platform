export const terminologyKeys = ['user','profile','discovery','match','matches','message','messages'] as const;
export type TerminologyKey = typeof terminologyKeys[number];
export type TerminologyConfiguration = Readonly<{ terms: Partial<Record<TerminologyKey, string>> }>;

const allowedKeys = new Set<string>(terminologyKeys);

/** Purchaser-facing labels only; stable implementation identifiers never change. */
export function validateTerminologyConfiguration(configuration: TerminologyConfiguration): void {
  if (!configuration || typeof configuration !== 'object' || !configuration.terms || typeof configuration.terms !== 'object' || Array.isArray(configuration.terms)) throw new Error('terminology terms are required');
  for (const [key, label] of Object.entries(configuration.terms)) {
    if (!allowedKeys.has(key)) throw new Error('terminology key must be a supported stable key');
    if (typeof label !== 'string') throw new Error('terminology label must be a string');
  }
}

/** Empty labels intentionally fall back to the caller's default presentation label. */
export function resolveTerminologyLabel(configuration: TerminologyConfiguration | undefined, key: TerminologyKey, fallback: string): string {
  const label = configuration?.terms[key]?.trim();
  return label || fallback;
}

export function normalizeTerminologyConfiguration(configuration: TerminologyConfiguration): TerminologyConfiguration {
  validateTerminologyConfiguration(configuration);
  const terms: Partial<Record<TerminologyKey, string>> = {};
  for (const key of terminologyKeys) {
    const label = configuration.terms[key]?.trim();
    if (label) terms[key] = label;
  }
  return Object.freeze({ terms: Object.freeze(terms) });
}
