import { Injectable } from '@nestjs/common';

export type HealthStatus = 'ok' | 'degraded';

export type HealthDependencyStatus = 'configured' | 'not-configured';

export interface HealthResponse {
  readonly status: HealthStatus;
  readonly database: HealthDependencyStatus;
  readonly jobs: HealthDependencyStatus;
  readonly queue: HealthDependencyStatus;
}

@Injectable()
export class HealthStatusService {
  health(): HealthResponse {
    return {
      status: process.env.DATABASE_URL ? 'ok' : 'degraded',
      database: process.env.DATABASE_URL ? 'configured' : 'not-configured',
      jobs: process.env.BACKGROUND_JOBS_ENABLED === 'true' ? 'configured' : 'not-configured',
      queue: process.env.QUEUE_URL ? 'configured' : 'not-configured',
    };
  }
}
