export interface QuickLaunchPublishedRecord {
  version?: number;
  publishedAt?: string;
  snapshot?: unknown;
  configuration?: unknown;
}

export function normalizeQuickLaunchRecord(value: unknown): QuickLaunchPublishedRecord {
  if (!value || typeof value !== 'object') return {};
  return value as QuickLaunchPublishedRecord;
}

export function formatQuickLaunchHistory(value: unknown): QuickLaunchPublishedRecord[] {
  return Array.isArray(value) ? value.map(normalizeQuickLaunchRecord) : [];
}
