import { describe, expect, it, afterEach } from 'vitest';
import { HealthStatusService } from './health/health-status.service.js';

const keys = ['DATABASE_URL', 'BACKGROUND_JOBS_ENABLED', 'QUEUE_URL'] as const;
const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of keys) {
    if (original[key] === undefined) delete process.env[key];
    else process.env[key] = original[key];
  }
});

describe('HealthStatusService', () => {
  it('reports dependency configuration without exposing connection values', () => {
    process.env.DATABASE_URL = 'secret://database';
    process.env.BACKGROUND_JOBS_ENABLED = 'true';
    process.env.QUEUE_URL = 'secret://queue';

    expect(new HealthStatusService().health()).toEqual({
      status: 'ok',
      database: 'configured',
      jobs: 'configured',
      queue: 'configured',
    });
  });

  it('marks unavailable dependencies as not configured', () => {
    delete process.env.DATABASE_URL;
    delete process.env.BACKGROUND_JOBS_ENABLED;
    delete process.env.QUEUE_URL;

    expect(new HealthStatusService().health()).toEqual({
      status: 'degraded',
      database: 'not-configured',
      jobs: 'not-configured',
      queue: 'not-configured',
    });
  });
});
