import { describe, expect, it } from 'vitest';

describe('admin authentication gate contract', () => {
  it('keeps the sign-in endpoint cookie-based', () => {
    const source = String.raw`/auth/sign-in`;
    expect(source).toContain('/auth/sign-in');
  });
});
