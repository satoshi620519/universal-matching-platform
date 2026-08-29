export type AccountState =
  | 'pending-onboarding'
  | 'active'
  | 'restricted'
  | 'suspended'
  | 'pending-deletion'
  | 'deleted-anonymized';

const transitions: Record<AccountState, readonly AccountState[]> = {
  'pending-onboarding': ['active', 'restricted', 'pending-deletion'],
  active: ['restricted', 'suspended', 'pending-deletion'],
  restricted: ['active', 'suspended', 'pending-deletion'],
  suspended: ['restricted', 'pending-deletion'],
  'pending-deletion': ['deleted-anonymized'],
  'deleted-anonymized': [],
};

export function canTransitionAccountState(from: AccountState, to: AccountState): boolean {
  return transitions[from].includes(to);
}
