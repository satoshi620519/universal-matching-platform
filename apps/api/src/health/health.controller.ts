import { Controller, Get, Inject } from '@nestjs/common';
import { HealthResponse, HealthStatusService } from './health-status.service.js';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(HealthStatusService)
    private readonly healthStatus: HealthStatusService,
  ) {}

  @Get()
  health(): HealthResponse {
    return this.healthStatus.health();
  }
}
