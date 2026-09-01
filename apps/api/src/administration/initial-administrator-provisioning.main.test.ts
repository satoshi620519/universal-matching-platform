import { describe, expect, it } from 'vitest';

import { parseAccountId } from './initial-administrator-provisioning.main.js';

describe('initial administrator provisioning command input', () => {
  it('accepts exactly one non-empty account id', () => {
    expect(parseAccountId(['node', 'command', 'account-1'])).toBe('account-1');
    expect(parseAccountId(['node', 'command', ' account-1 '])).toBe('account-1');
  });

  it('rejects missing or additional arguments', () => {
    expect(() => parseAccountId(['node', 'command'])).toThrow('usage:');
    expect(() => parseAccountId(['node', 'command', 'account-1', 'extra'])).toThrow(
      'exactly one accountId',
    );
  });
});
