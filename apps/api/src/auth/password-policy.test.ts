import { describe, expect, it } from 'vitest';

import { MinimumPasswordPolicy } from './password-policy.js';

describe('MinimumPasswordPolicy', () => {
  const policy = new MinimumPasswordPolicy();

  it('rejects passwords shorter than the configured minimum', () => {
    expect(policy.validate('short')).toEqual([{ code: 'minimum_length' }]);
  });

  it('accepts a password at the minimum length', () => {
    expect(policy.validate('123456789012')).toEqual([]);
  });

  it('rejects excessively long passwords', () => {
    expect(policy.validate('x'.repeat(1025))).toEqual([{ code: 'maximum_length' }]);
  });
});
