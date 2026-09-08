export interface DemoSeedAccount {
  readonly key: 'member-a' | 'member-b' | 'member-c' | 'administrator';
  readonly profile: boolean;
  readonly administrator: boolean;
}

export const DEMO_SEED_ACCOUNTS: readonly DemoSeedAccount[] = [
  { key: 'member-a', profile: true, administrator: false },
  { key: 'member-b', profile: true, administrator: false },
  { key: 'member-c', profile: true, administrator: false },
  { key: 'administrator', profile: false, administrator: true },
] as const;

export const DEMO_SEED_JOURNEYS = [
  'profile-discovery',
  'mutual-match',
  'conversation',
  'notification',
  'administration',
] as const;

export function createDemoSeedPlan() {
  return {
    accounts: DEMO_SEED_ACCOUNTS,
    journeys: DEMO_SEED_JOURNEYS,
    fictionalOnly: true,
  } as const;
}
