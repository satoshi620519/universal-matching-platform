import { describe, expect, it } from 'vitest';
import { DEMO_ACCOUNT_IDS, DemoSeedService } from './demo-seed.service.js';

describe('DemoSeedService', () => {
  it('exposes the approved deterministic demo journey plan', () => {
    const service = Object.create(DemoSeedService.prototype) as DemoSeedService;
    expect(service.plan().fictionalOnly).toBe(true);
    expect(service.plan().journeys).toContain('conversation');
  });

  it('uses stable fictional account identifiers for a reproducible baseline', () => {
    expect(Object.values(DEMO_ACCOUNT_IDS)).toHaveLength(4);
    expect(new Set(Object.values(DEMO_ACCOUNT_IDS)).size).toBe(4);
  });
});
