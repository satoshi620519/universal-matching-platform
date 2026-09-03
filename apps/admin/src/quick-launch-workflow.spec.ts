import { describe, expect, it } from 'vitest';
import { createQuickLaunchWorkflow, quickLaunchSteps } from './quick-launch-workflow.js';

describe('Quick Launch admin workflow', () => {
  it('maps purchaser actions to the authorized API workflow', async () => {
    const calls: Array<{ path: string; method?: string }> = [];
    const workflow = createQuickLaunchWorkflow({
      async request(path, init) { calls.push({ path, method: init?.method }); return {}; },
    });
    const draft = {
      applicationName: 'Launch', primaryColor: '#123456', supportedCountries: ['JP'],
      categories: [{ key: 'dating', displayName: 'Dating' }], enabledFeatures: ['matching'],
      onboarding: [{ field: 'displayName', required: true }],
    };
    await workflow.createDraft(draft);
    await workflow.saveDraft(1, draft);
    await workflow.publish(1);
    expect(calls).toEqual([
      { path: '/administration/quick-launch/drafts', method: 'POST' },
      { path: '/administration/quick-launch/drafts/1', method: 'POST' },
      { path: '/administration/quick-launch/drafts/1/publish', method: 'POST' },
    ]);
    expect(quickLaunchSteps).toEqual(['Branding','Regions','Categories','Profile Schema','Matching Categories','Features','Legal & Support','Terminology','Matching Rules','Onboarding','Review & Publish']);
  });
});
