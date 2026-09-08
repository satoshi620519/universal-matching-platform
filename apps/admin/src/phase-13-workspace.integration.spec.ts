import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('admin Phase 13 workspace integration', () => {
  it('mounts every capability-gated workspace from the browser entrypoint', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/main.tsx'), 'utf8');

    expect(source).toContain("import './administrative-workspace-navigation-ui';");
    expect(source).toContain("import './moderation-console';");
    expect(source).toContain("import './failed-email-outbox-console';");
    expect(source).toContain("import './administrative-roles-console';");
    expect(source).toContain("import './analytics-console';");
    expect(source).toContain("import './system-health-console';");
    expect(source).toContain("import './administrative-accounts-console';");
  });

  it('keeps workspace capabilities centralized in the navigation model', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/administrative-workspace-navigation.ts'), 'utf8');

    expect(source).toContain("'manage-quick-launch'");
    expect(source).toContain("'manage-moderation'");
    expect(source).toContain("'manage-administrative-roles'");
    expect(source).toContain("'review-failed-email-outbox'");
    expect(source).toContain("'view-analytics'");
    expect(source).toContain("'view-system-health'");
    expect(source).toContain("'lookup-accounts'");
  });
});
