import { requireDemoEnvironment } from './demo-environment-guard.js';

export function assertDemoResetEnvironment(
  environment: Record<string, string | undefined> = process.env,
): void {
  requireDemoEnvironment(environment);
}

async function main(): Promise<void> {
  assertDemoResetEnvironment();
  throw new Error(
    'Demo reset data plan is not implemented yet; environment guard passed but no destructive operation was performed',
  );
}

if (process.env.VITEST !== 'true') {
  void main();
}
