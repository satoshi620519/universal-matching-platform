export const DEMO_ENVIRONMENT_MARKER = 'demo';

export function requireDemoEnvironment(
  environment: Record<string, string | undefined> = process.env,
): void {
  if (environment.NODE_ENV !== DEMO_ENVIRONMENT_MARKER || environment.DEMO_MODE !== 'true') {
    throw new Error(
      'Demo reset is refused unless NODE_ENV=demo and DEMO_MODE=true are explicitly set',
    );
  }
}
