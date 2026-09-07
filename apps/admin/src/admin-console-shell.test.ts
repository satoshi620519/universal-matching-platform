import { describe, expect, it } from 'vitest';
import { ADMIN_CONSOLE_NAVIGATION, isAdminConsoleSection } from './admin-console-shell.js';

describe('admin console shell', () => {
  it('exposes every currently wired operational section exactly once', () => {
    expect(ADMIN_CONSOLE_NAVIGATION.map((item) => item.id)).toEqual([
      'dashboard', 'users', 'profiles', 'moderation', 'audit',
      'matches', 'conversations', 'system-health', 'quick-launch',
    ]);
  });

  it('recognizes only declared navigation sections', () => {
    expect(isAdminConsoleSection('users')).toBe(true);
    expect(isAdminConsoleSection('analytics')).toBe(false);
  });
});
