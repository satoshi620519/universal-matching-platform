import { describe, expect, it } from 'vitest';
import { DomainError, createEntityId, createInstantString } from './index.js';

describe('domain primitives', () => {
  it('creates a non-empty entity id', () => {
    expect(createEntityId(' user-1 ')).toBe('user-1');
  });

  it('rejects an empty entity id', () => {
    expect(() => createEntityId(' ')).toThrow('EntityId must not be empty');
  });

  it('normalizes valid instants to ISO format', () => {
    expect(createInstantString('2026-01-01T00:00:00Z')).toBe('2026-01-01T00:00:00.000Z');
  });

  it('provides a stable domain error code', () => {
    const error = new DomainError('VALIDATION_ERROR', 'Invalid value');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.name).toBe('DomainError');
  });
});
