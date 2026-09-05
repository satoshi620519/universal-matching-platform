import { describe, expect, it } from 'vitest';
import { createUserBlock } from './user-block.js';

describe('createUserBlock', () => {
  it('normalizes account ids and timestamp', () => {
    expect(createUserBlock({ blockerAccountId: ' blocker ', blockedAccountId: 'blocked' }, '2026-09-04T00:00:00Z')).toEqual({
      blockerAccountId: 'blocker',
      blockedAccountId: 'blocked',
      createdAt: '2026-09-04T00:00:00.000Z',
    });
  });

  it('rejects empty account ids', () => {
    expect(() => createUserBlock({ blockerAccountId: ' ', blockedAccountId: 'blocked' })).toThrow('block account ids are required');
  });

  it('rejects self-blocking', () => {
    expect(() => createUserBlock({ blockerAccountId: 'same', blockedAccountId: 'same' })).toThrow('an account cannot block itself');
  });

  it('rejects invalid timestamps', () => {
    expect(() => createUserBlock({ blockerAccountId: 'a', blockedAccountId: 'b' }, 'invalid')).toThrow('createdAt is invalid');
  });
});
