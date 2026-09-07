export type AdministrativeCapability =
  | 'manage-administrative-roles'
  | 'review-failed-email-outbox'
  | 'manage-moderation'
  | 'manage-quick-launch'
  | 'view-analytics';

export type AdministrativeWorkspaceTarget = Readonly<{
  id: 'quick-launch' | 'moderation' | 'roles' | 'failed-email' | 'analytics';
  label: string;
  capability: AdministrativeCapability;
}>;

export const administrativeWorkspaceTargets: readonly AdministrativeWorkspaceTarget[] = [
  { id: 'quick-launch', label: 'Quick Launch', capability: 'manage-quick-launch' },
  { id: 'moderation', label: 'Moderation', capability: 'manage-moderation' },
  { id: 'roles', label: 'Roles', capability: 'manage-administrative-roles' },
  { id: 'failed-email', label: 'Failed email', capability: 'review-failed-email-outbox' },
  { id: 'analytics', label: 'Analytics', capability: 'view-analytics' },
];

export function visibleAdministrativeWorkspaceTargets(
  granted: readonly AdministrativeCapability[],
): AdministrativeWorkspaceTarget[] {
  const capabilities = new Set(granted);
  return administrativeWorkspaceTargets.filter((target) => capabilities.has(target.capability));
}
