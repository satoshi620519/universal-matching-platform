import { describe, expect, it } from 'vitest';
import { visibleAdministrativeWorkspaceTargets } from './administrative-workspace-navigation';

describe('visibleAdministrativeWorkspaceTargets', () => {
  it('returns only targets backed by granted capabilities', () => {
    expect(visibleAdministrativeWorkspaceTargets([
      'manage-quick-launch',
      'manage-moderation',
    ]).map((target) => target.id)).toEqual(['quick-launch', 'moderation']);
  });

  it('returns no targets without administrative capabilities', () => {
    expect(visibleAdministrativeWorkspaceTargets([])).toEqual([]);
  });
});
