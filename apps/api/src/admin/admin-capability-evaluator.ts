import type { AdminCapability } from './admin-capability.js';
import { roleCapabilities } from './admin-capability.js';

export interface ActiveRoleAssignment { readonly role: string; }

export function hasAdminCapability(assignments: readonly ActiveRoleAssignment[], required: AdminCapability): boolean {
  return assignments.some(({ role }) => (roleCapabilities[role as keyof typeof roleCapabilities] ?? []).includes(required));
}
