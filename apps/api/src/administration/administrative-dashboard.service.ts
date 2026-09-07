import { Injectable } from '@nestjs/common';

import { HealthStatusService } from '../health/health-status.service.js';
import { AdministrativeCapabilityAccessService } from './administrative-capability-access.service.js';

export interface AdministrativeDashboardResponse {
  readonly systemHealth: ReturnType<HealthStatusService['health']>;
  readonly availableSections: readonly string[];
}

@Injectable()
export class AdministrativeDashboardService {
  constructor(
    private readonly capabilities: AdministrativeCapabilityAccessService,
    private readonly healthStatus: HealthStatusService,
  ) {}

  async read(accountId: string): Promise<AdministrativeDashboardResponse> {
    await this.capabilities.require(accountId, 'view-dashboard');
    return {
      systemHealth: this.healthStatus.health(),
      availableSections: ['dashboard', 'users', 'profiles', 'moderation', 'audit', 'system-health', 'quick-launch'],
    };
  }
}
