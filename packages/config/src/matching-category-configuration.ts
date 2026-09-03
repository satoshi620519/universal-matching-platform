export interface MatchingCategory {
  key: string;
  label: string;
  description?: string;
  enabled: boolean;
}

export interface MatchingCategoryConfiguration {
  categories: readonly MatchingCategory[];
}

export function normalizeMatchingCategoryConfiguration(
  value: MatchingCategoryConfiguration | undefined,
): MatchingCategoryConfiguration | undefined {
  if (!value) return undefined;
  const seen = new Set<string>();
  const categories = value.categories.flatMap((category) => {
    const key = category.key.trim();
    const label = category.label.trim();
    if (!key || !label || seen.has(key)) return [];
    seen.add(key);
    return [{ key, label, description: category.description?.trim() || undefined, enabled: category.enabled !== false }];
  });
  return categories.length ? { categories } : undefined;
}
