export type AdminConsoleSection =
  | 'dashboard'
  | 'users'
  | 'profiles'
  | 'moderation'
  | 'audit'
  | 'matches'
  | 'conversations'
  | 'system-health'
  | 'quick-launch';

export interface AdminConsoleNavigationItem {
  id: AdminConsoleSection;
  label: string;
  description: string;
}

export const ADMIN_CONSOLE_NAVIGATION: readonly AdminConsoleNavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', description: '運営状況の概要' },
  { id: 'users', label: 'Users', description: 'アカウント一覧と運営確認' },
  { id: 'profiles', label: 'Profiles', description: 'プロフィール運用確認' },
  { id: 'moderation', label: 'Moderation', description: '通報・安全・審査' },
  { id: 'audit', label: 'Audit Logs', description: '管理操作の監査記録' },
  { id: 'matches', label: 'Matches', description: 'マッチング状態の確認' },
  { id: 'conversations', label: 'Conversations', description: '会話メタデータの確認' },
  { id: 'system-health', label: 'System Health', description: '運用システムの状態' },
  { id: 'quick-launch', label: 'Quick Launch', description: '設定・機能・テーマ・地域・ローカライズ' },
];

export function isAdminConsoleSection(value: string): value is AdminConsoleSection {
  return ADMIN_CONSOLE_NAVIGATION.some((item) => item.id === value);
}
