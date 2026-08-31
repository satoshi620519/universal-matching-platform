import { Injectable } from '@nestjs/common';

export type HealthStatus = 'ok' | 'degraded';

export interface HealthResponse {
  readonly status: HealthStatus;
  readonly database: 'configured' | 'not-configured';
}

@Injectable()
export class HealthStatusService {
  health(): HealthResponse {
    return {
      status: process.env.DATABASE_URL ? 'ok' : 'degraded',
      database: process.env.DATABASE_URL ? 'configured' : 'not-configured',
    };
  }
}
