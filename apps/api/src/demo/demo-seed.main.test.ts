import { describe, expect, it } from 'vitest';
import { requireDemoEnvironment } from './demo-environment-guard.js';

describe('demo seed command boundary', () => {
  it('shares the explicit demo-only safety boundary', () => {
    expect(() =>
      requireDemoEnvironment({ NODE_ENV: 'production', DEMO_MODE: 'true' }),
    ).toThrow('Demo reset is refused');
    expect(() =>
      requireDemoEnvironment({ NODE_ENV: 'demo', DEMO_MODE: 'true' }),
    ).not.toThrow();
  });
});
