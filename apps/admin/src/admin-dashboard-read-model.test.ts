import { describe, expect, it } from 'vitest';

import { createAdminDashboardReadModel } from './admin-dashboard-read-model';

describe('createAdminDashboardReadModel', () => {
  it('creates an immutable-shaped dashboard read model without changing values', () => {
    const sections = ['dashboard', 'moderation', 'quick-launch'];
    const model = createAdminDashboardReadModel({
      systemHealth: { status: 'ok', database: 'configured' },
      availableSections: sections,
    });

    expect(model).toEqual({
      systemHealth: { status: 'ok', database: 'configured' },
      availableSections: sections,
    });
    expect(model.availableSections).not.toBe(sections);
  });
});
