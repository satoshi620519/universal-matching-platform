import { describe, expect, it } from 'vitest';
import { DemoSeedService } from './demo-seed.service.js';

describe('DemoSeedService', () => {
  it('exposes the approved deterministic demo journey plan', () => {
    const service = Object.create(DemoSeedService.prototype) as DemoSeedService;
    expect(service.plan().fictionalOnly).toBe(true);
    expect(service.plan().journeys).toContain('conversation');
  });
});
