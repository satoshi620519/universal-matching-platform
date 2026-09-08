import { describe, expect, it } from 'vitest';
import { assertDemoResetEnvironment } from './demo-reset.main.js';

describe('demo reset command boundary', () => {
  it('refuses execution outside the explicit demo environment', () => {
    expect(() =>
      assertDemoResetEnvironment({ NODE_ENV: 'production', DEMO_MODE: 'true' }),
    ).toThrow('Demo reset is refused');
  });

  it('requires an explicit demo environment and never relies on NODE_ENV alone', () => {
    expect(() =>
      assertDemoResetEnvironment({ NODE_ENV: 'demo' }),
    ).toThrow('Demo reset is refused');
  });

  it('allows the command boundary only for explicitly marked demo environments', () => {
    expect(() =>
      assertDemoResetEnvironment({ NODE_ENV: 'demo', DEMO_MODE: 'true' }),
    ).not.toThrow();
  });
});
