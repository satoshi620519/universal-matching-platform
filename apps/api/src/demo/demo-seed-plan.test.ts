import { describe, expect, it } from 'vitest';
import { createDemoSeedPlan } from './demo-seed-plan.js';

describe('demo seed plan', () => {
  it('covers the representative buyer journeys with fictional accounts', () => {
    const plan = createDemoSeedPlan();
    expect(plan.accounts).toHaveLength(4);
    expect(plan.accounts.filter((account) => account.profile)).toHaveLength(3);
    expect(plan.accounts.filter((account) => account.administrator)).toHaveLength(1);
    expect(plan.journeys).toContain('mutual-match');
    expect(plan.journeys).toContain('conversation');
    expect(plan.fictionalOnly).toBe(true);
  });
});
