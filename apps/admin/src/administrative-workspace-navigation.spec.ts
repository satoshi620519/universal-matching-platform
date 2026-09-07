import { describe, expect, it } from 'vitest';
import { administrativeWorkspaceTargets, visibleAdministrativeWorkspaceTargets } from './administrative-workspace-navigation';

describe('visibleAdministrativeWorkspaceTargets', () => {
  it('returns only targets backed by granted capabilities', () => {
    expect(visibleAdministrativeWorkspaceTargets([
      'manage-quick-launch',
      'manage-moderation',
    ]).map((target) => target.id)).toEqual(['quick-launch', 'moderation']);
  });

  it('returns all declared targets when every capability is granted', () => {
    expect(visibleAdministrativeWorkspaceTargets(
      administrativeWorkspaceTargets.map((target) => target.capability),
    )).toHaveLength(administrativeWorkspaceTargets.length);
  });

  it('returns no targets without administrative capabilities', () => {
    expect(visibleAdministrativeWorkspaceTargets([])).toEqual([]);
  });
});
