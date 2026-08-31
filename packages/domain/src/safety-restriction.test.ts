import { describe, expect, it } from 'vitest';
import { blocksCapability, effectiveAccountState } from './safety-restriction.js';

describe('safety restriction policy', () => {
  it('blocks all scoped capabilities for feature restrictions', () => {
    expect(blocksCapability('feature-restricted', 'general')).toBe(true);
    expect(blocksCapability('feature-restricted', 'communication')).toBe(true);
  });

  it('blocks only communication scope for communication restrictions', () => {
    expect(blocksCapability('communication-restricted', 'general')).toBe(false);
    expect(blocksCapability('communication-restricted', 'communication')).toBe(true);
  });

  it('maps a suspension restriction to the account suspension state', () => {
    expect(effectiveAccountState('active', 'suspended')).toBe('suspended');
  });

  it('does not change account state for non-suspension restrictions', () => {
    expect(effectiveAccountState('active', 'communication-restricted')).toBe('active');
  });
});
