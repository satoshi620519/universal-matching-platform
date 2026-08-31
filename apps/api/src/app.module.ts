import { Module } from '@nestjs/common';
import { AccountRepository } from './accounts/account.repository.js';
import { PrismaAccountRepository } from './accounts/prisma-account.repository.js';
import { AnonymousAuthenticationAdapter } from './auth/anonymous-authentication.adapter.js';
import { RequestAuthenticationAdapter } from './auth/authentication-adapter.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthController } from './health/health.controller.js';
import { HealthStatusService } from './health/health-status.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthController],
  providers: [
    HealthStatusService,
    PrismaAccountRepository,
    AnonymousAuthenticationAdapter,
    {
      provide: AccountRepository,
      useExisting: PrismaAccountRepository,
    },
    {
      provide: RequestAuthenticationAdapter,
      useExisting: AnonymousAuthenticationAdapter,
    },
  ],
})
export class AppModule {}
