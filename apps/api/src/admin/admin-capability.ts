export const adminCapabilities = ['moderation.read','moderation.decide','account.restrict','audit.read','configuration.read','configuration.write'] as const;
export type AdminCapability = (typeof adminCapabilities)[number];

export const roleCapabilities = {
  moderator: ['moderation.read','moderation.decide'],
  safety_admin: ['moderation.read','moderation.decide','account.restrict','audit.read'],
  platform_admin: adminCapabilities,
} as const satisfies Record<string, readonly AdminCapability[]>;
