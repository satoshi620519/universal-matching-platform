import { describe, expect, it } from 'vitest';
import { createQuickLaunchWorkflow } from './quick-launch-workflow.js';

describe('Quick Launch lifecycle contract', () => {
  it('executes create → save → publish → published → history without changing endpoint contracts', async () => {
    const calls: string[] = [];
    const workflow = createQuickLaunchWorkflow({
      async request(path, init) {
        calls.push(`${init?.method ?? 'GET'} ${path}`);
        if (path.endsWith('/drafts')) return { version: 7 };
        if (path.endsWith('/published')) return { version: 7 };
        if (path.endsWith('/history')) return [{ version: 7 }];
        return { version: 7 };
      },
    });
    const draft = { applicationName: 'Launch', primaryColor: '#123456', supportedCountries: ['JP'], categories: [{ key: 'dating', displayName: 'Dating' }], enabledFeatures: ['matching'], onboarding: [{ field: 'displayName', required: true }] };
    await workflow.createDraft(draft);
    await workflow.saveDraft(7, draft);
    await workflow.publish(7);
    await workflow.published();
    await workflow.history();
    expect(calls).toEqual([
      'POST /administration/quick-launch/drafts',
      'POST /administration/quick-launch/drafts/7',
      'POST /administration/quick-launch/drafts/7/publish',
      'GET /administration/quick-launch/published',
      'GET /administration/quick-launch/history',
    ]);
  });
});
