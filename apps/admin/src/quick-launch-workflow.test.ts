import { describe, expect, it, vi } from 'vitest';
import { createQuickLaunchWorkflow, quickLaunchSteps, type QuickLaunchDraftInput } from './quick-launch-workflow';

const draft: QuickLaunchDraftInput = {
  applicationName: 'Test', primaryColor: '#000000', brandingTheme: { primaryColor: '#000000' },
  supportedCountries: ['JP'], categories: [{ key: 'dating', displayName: 'Dating' }],
  enabledFeatures: ['matching'], onboarding: [{ field: 'displayName', required: true }],
};

describe('createQuickLaunchWorkflow', () => {
  it('uses stable draft, publish and history endpoints', async () => {
    const request = vi.fn().mockResolvedValue({});
    const workflow = createQuickLaunchWorkflow({ request });
    await workflow.createDraft(draft);
    await workflow.saveDraft(2, draft);
    await workflow.publish(2);
    await workflow.published();
    await workflow.history();
    expect(request.mock.calls.map(call => call[0])).toEqual([
      '/administration/quick-launch/drafts',
      '/administration/quick-launch/drafts/2',
      '/administration/quick-launch/drafts/2/publish',
      '/administration/quick-launch/published',
      '/administration/quick-launch/history',
    ]);
  });
});


describe('quickLaunchSteps', () => {
  it('keeps purchaser-facing configuration domains in one workflow', () => {
    expect(quickLaunchSteps).toEqual(['Branding','Regions','Categories','Profile Schema','Matching Categories','Features','Legal & Support','Terminology','Matching Rules','Onboarding','Review & Publish']);
  });
});
