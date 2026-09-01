import type { AdministrativeRoleKey } from '@universal/domain';

export type AdministrativeCapability =
  | 'manage-administrative-roles'
  | 'review-failed-email-outbox';

const capabilityRoles: Readonly<Record<AdministrativeCapability, readonly AdministrativeRoleKey[]>> = {
  'manage-administrative-roles': ['administrator'],
  'review-failed-email-outbox': ['moderator', 'administrator'],
};

export function rolesForAdministrativeCapability(
  capability: AdministrativeCapability,
): readonly AdministrativeRoleKey[] {
  return capabilityRoles[capability];
}
