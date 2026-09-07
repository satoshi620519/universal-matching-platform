import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { QuickLaunchConfigurationController } from './quick-launch-configuration.controller.js';

describe('QuickLaunchConfigurationController', () => {
  const setup = () => {
    const principals = { requireAuthenticated: vi.fn().mockResolvedValue({ accountId: 'admin-1' }) };
    const access = { require: vi.fn().mockResolvedValue(undefined) };
    const quickLaunch = {
      createDraft: vi.fn(), saveDraft: vi.fn(), publish: vi.fn(), findPublished: vi.fn(), listHistory: vi.fn(),
    };
    return { principals, access, quickLaunch, controller: new QuickLaunchConfigurationController(principals as never, access as never, quickLaunch as never) };
  };

  it('requires manage-quick-launch before writes', async () => {
    const { controller, access, quickLaunch } = setup();
    await controller.create({ applicationName: 'Demo' } as never, 'Bearer token');
    expect(access.require).toHaveBeenCalledWith('admin-1', 'manage-quick-launch');
    expect(quickLaunch.createDraft).toHaveBeenCalled();
  });

  it('rejects invalid versions before persistence', async () => {
    const { controller, quickLaunch } = setup();
    await expect(controller.save('0', {} as never)).rejects.toBeInstanceOf(BadRequestException);
    await expect(controller.publish('x')).rejects.toBeInstanceOf(BadRequestException);
    expect(quickLaunch.saveDraft).not.toHaveBeenCalled();
    expect(quickLaunch.publish).not.toHaveBeenCalled();
  });
});
