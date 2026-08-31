import { randomUUID } from 'node:crypto';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

export function resolveCorrelationId(
  incoming: string | string[] | undefined,
): string {
  if (typeof incoming === 'string' && incoming.trim().length > 0) {
    return incoming.trim();
  }

  if (Array.isArray(incoming)) {
    const value = incoming.find((item) => item.trim().length > 0);
    if (value) return value.trim();
  }

  return randomUUID();
}
