import { Controller, Get, Headers } from '@nestjs/common';

import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AdministrativeCapabilityAccessService } from './administrative-capability-access.service.js';
import { type AdministrativeCapability } from './administrative-capability-policy.js';

const capabilities: readonly AdministrativeCapability[] = [
  'manage-administrative-roles',
  'review-failed-email-outbox',
  'manage-moderation',
  'manage-quick-launch',
  'view-analytics',
];

@Controller('administration/me')
export class AdministrativeCapabilitiesController {
  constructor(
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly access: AdministrativeCapabilityAccessService,
  ) {}

  @Get('capabilities')
  async list(
    @Headers('authorization') authorization?: string,
    @Headers('x-correlation-id') correlationHeader?: string,
  ) {
    const correlationId = correlationHeader?.trim() || undefined;
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: correlationId ?? 'administration-me-capabilities',
    });
    const granted = await Promise.all(
      capabilities.map(async (capability) => ({
        capability,
        granted: await this.access.can(principal.accountId, capability),
      })),
    );
    return { capabilities: granted.filter((entry) => entry.granted).map((entry) => entry.capability) };
  }
}
