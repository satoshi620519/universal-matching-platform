import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller.js';
import { HealthStatusService } from './health/health-status.service.js';

@Module({
  controllers: [HealthController],
  providers: [HealthStatusService],
})
export class AppModule {}
