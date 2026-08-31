export function normalizeEmailProviderSubject(value: string): string | null {
  const trimmed = value.trim();

  if (trimmed.length === 0 || trimmed.length > 320) {
    return null;
  }

  const at = trimmed.lastIndexOf('@');
  if (at <= 0 || at === trimmed.length - 1) {
    return null;
  }

  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);

  if (local.length > 64 || domain.length > 255 || /\s/.test(trimmed)) {
    return null;
  }

  return `${local}@${domain.toLowerCase()}`;
}
