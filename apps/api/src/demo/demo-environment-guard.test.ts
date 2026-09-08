import { describe, expect, it } from 'vitest';
import { requireDemoEnvironment } from './demo-environment-guard.js';

describe('demo environment guard', () => {
  it('accepts only an explicitly marked demo environment', () => {
    expect(() =>
      requireDemoEnvironment({ NODE_ENV: 'demo', DEMO_MODE: 'true' }),
    ).not.toThrow();
  });

  it('refuses development, production, and partially marked environments', () => {
    expect(() => requireDemoEnvironment({})).toThrow('Demo reset is refused');
    expect(() => requireDemoEnvironment({ NODE_ENV: 'production', DEMO_MODE: 'true' })).toThrow('Demo reset is refused');
    expect(() => requireDemoEnvironment({ NODE_ENV: 'demo' })).toThrow('Demo reset is refused');
  });
});
