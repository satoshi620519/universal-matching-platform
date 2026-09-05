import { describe, expect, it } from 'vitest';
import { hasAdminCapability } from './admin-capability-evaluator.js';

describe('hasAdminCapability', () => {
  it('denies by default when no assignment exists', () => expect(hasAdminCapability([], 'audit.read')).toBe(false));
  it('denies unknown roles', () => expect(hasAdminCapability([{ role: 'unknown' }], 'audit.read')).toBe(false));
  it('allows only moderator capabilities', () => {
    expect(hasAdminCapability([{ role: 'moderator' }], 'moderation.decide')).toBe(true);
    expect(hasAdminCapability([{ role: 'moderator' }], 'account.restrict')).toBe(false);
  });
  it('allows all initial capabilities to platform admin', () => expect(hasAdminCapability([{ role: 'platform_admin' }], 'configuration.write')).toBe(true));
});
