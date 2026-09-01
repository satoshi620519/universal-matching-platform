import { describe, expect, it } from 'vitest';
import { createMatchTransitionCommand } from './match-transition.js';

describe('mutual match transition contract', () => {
  const base = { actorAccountId: 'a1', targetAccountId: 'a2', decision: 'like' as const, idempotencyKey: 'k1' };
  it('accepts an idempotent directed interaction command', () => {
    expect(createMatchTransitionCommand(base)).toEqual(base);
  });
  it('rejects self transitions and missing idempotency keys', () => {
    expect(() => createMatchTransitionCommand({ ...base, targetAccountId: 'a1' })).toThrow('cannot target self');
    expect(() => createMatchTransitionCommand({ ...base, idempotencyKey: ' ' })).toThrow('idempotencyKey');
  });
});
