export const terminologyKeys = ['user','profile','discovery','match','matches','message','messages'] as const;
export type TerminologyKey = typeof terminologyKeys[number];
export type TerminologyConfiguration = Readonly<Partial<Record<TerminologyKey, string>>>;

const allowedKeys = new Set<string>(terminologyKeys);

/** Purchaser-facing labels only; stable implementation identifiers never change. */
export function validateTerminologyConfiguration(configuration: TerminologyConfiguration): void {
  for (const [key, label] of Object.entries(configuration)) {
    if (!allowedKeys.has(key)) throw new Error('terminology key must be a supported stable key');
    if (typeof label !== 'string') throw new Error('terminology label must be a string');
  }
}

/** Empty labels intentionally fall back to the caller's default presentation label. */
export function resolveTerminologyLabel(configuration: TerminologyConfiguration | undefined, key: TerminologyKey, fallback: string): string {
  const label = configuration?.[key]?.trim();
  return label || fallback;
}

export function normalizeTerminologyConfiguration(configuration: TerminologyConfiguration): TerminologyConfiguration {
  validateTerminologyConfiguration(configuration);
  const normalized: Partial<Record<TerminologyKey, string>> = {};
  for (const key of terminologyKeys) {
    const label = configuration[key]?.trim();
    if (label) normalized[key] = label;
  }
  return Object.freeze(normalized);
}
