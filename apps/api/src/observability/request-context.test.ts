import { describe, expect, it } from 'vitest';
import { resolveCorrelationId } from './request-context.js';

describe('request correlation', () => {
  it('preserves a supplied correlation identifier', () => {
    expect(resolveCorrelationId('corr-123')).toBe('corr-123');
  });

  it('creates an identifier when none is supplied', () => {
    expect(resolveCorrelationId(undefined)).toMatch(/^[0-9a-f-]{36}$/);
  });
});
