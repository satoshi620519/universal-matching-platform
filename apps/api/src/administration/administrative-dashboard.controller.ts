import { Controller, Get, Headers, Inject } from '@nestjs/common';

import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AdministrativeDashboardService } from './administrative-dashboard.service.js';

@Controller('administration/dashboard')
export class AdministrativeDashboardController {
  constructor(
    @Inject(RequestPrincipalResolver)
    private readonly principalResolver: RequestPrincipalResolver,
    @Inject(AdministrativeDashboardService)
    private readonly dashboard: AdministrativeDashboardService,
  ) {}

  @Get()
  async read(
    @Headers('authorization') authorization?: string,
    @Headers('x-correlation-id') correlationHeader?: string,
  ) {
    const correlationId = correlationHeader?.trim() || 'administration-dashboard-read';
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: correlationId,
    });
    return this.dashboard.read(principal.accountId);
  }
}
