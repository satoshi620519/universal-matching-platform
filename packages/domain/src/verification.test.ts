import { describe, expect, it } from 'vitest';
import { canTransitionVerificationStatus, isVerificationUsable } from './verification.js';

describe('verification lifecycle', () => {
  it('accepts an active verification without expiry', () => {
    expect(isVerificationUsable({ level: 2, status: 'verified' }, '2026-01-01T00:00:00.000Z')).toBe(true);
  });

  it('accepts a verified record before expiry', () => {
    expect(
      isVerificationUsable(
        { level: 2, status: 'verified', expiresAt: '2026-02-01T00:00:00.000Z' },
        '2026-01-15T00:00:00.000Z',
      ),
    ).toBe(true);
  });

  it('rejects an expired verification', () => {
    expect(
      isVerificationUsable(
        { level: 2, status: 'verified', expiresAt: '2026-01-01T00:00:00.000Z' },
        '2026-01-02T00:00:00.000Z',
      ),
    ).toBe(false);
  });

  it('rejects non-verified statuses', () => {
    expect(isVerificationUsable({ level: 2, status: 'pending' }, '2026-01-01T00:00:00.000Z')).toBe(false);
    expect(isVerificationUsable({ level: 2, status: 'revoked' }, '2026-01-01T00:00:00.000Z')).toBe(false);
  });

  it('allows only the defined forward verification lifecycle transitions', () => {
    expect(canTransitionVerificationStatus('not-started', 'pending')).toBe(true);
    expect(canTransitionVerificationStatus('pending', 'verified')).toBe(true);
    expect(canTransitionVerificationStatus('pending', 'failed')).toBe(true);
    expect(canTransitionVerificationStatus('pending', 'expired')).toBe(true);
    expect(canTransitionVerificationStatus('verified', 'expired')).toBe(true);
    expect(canTransitionVerificationStatus('verified', 'revoked')).toBe(true);
    expect(canTransitionVerificationStatus('failed', 'pending')).toBe(false);
    expect(canTransitionVerificationStatus('revoked', 'verified')).toBe(false);
    expect(canTransitionVerificationStatus('expired', 'verified')).toBe(false);
  });
});
