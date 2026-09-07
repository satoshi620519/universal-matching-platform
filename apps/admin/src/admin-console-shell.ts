export type AdminConsoleSection =
  | 'dashboard'
  | 'moderation'
  | 'quick-launch';

export interface AdminConsoleNavigationItem {
  id: AdminConsoleSection;
  label: string;
  description: string;
}

export const ADMIN_CONSOLE_NAVIGATION: readonly AdminConsoleNavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: '運営状況の概要',
  },
  {
    id: 'moderation',
    label: 'Moderation',
    description: '安全・通報・審査',
  },
  {
    id: 'quick-launch',
    label: 'Quick Launch',
    description: '公開前の主要設定',
  },
];

export function isAdminConsoleSection(value: string): value is AdminConsoleSection {
  return ADMIN_CONSOLE_NAVIGATION.some((item) => item.id === value);
}
