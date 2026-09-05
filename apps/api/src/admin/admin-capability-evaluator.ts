import type { AdminCapability } from './admin-capability.js';

export interface ActiveRoleAssignment { readonly role: string; }

export function hasAdminCapability(assignments: readonly ActiveRoleAssignment[], required: AdminCapability): boolean {
  return assignments.some(({ role }) => role === 'platform_admin' || (role === 'safety_admin' && ['moderation.read','moderation.decide','account.restrict','audit.read'].includes(required)) || (role === 'moderator' && ['moderation.read','moderation.decide'].includes(required)));
}
