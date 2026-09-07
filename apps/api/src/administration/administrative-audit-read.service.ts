import { Injectable } from '@nestjs/common';
import { AdministrativeCapabilityAccessService } from './administrative-capability-access.service.js';
import { AdministrativeAuditReadRepository } from './administrative-audit-read.repository.js';

@Injectable()
export class AdministrativeAuditReadService {
  constructor(
    private readonly access: AdministrativeCapabilityAccessService,
    private readonly audit: AdministrativeAuditReadRepository,
  ) {}

  async list(input: { readonly accountId: string; readonly cursor?: string; readonly limit?: number }) {
    await this.access.require(input.accountId, 'view-dashboard');
    return this.audit.list({
      cursor: input.cursor,
      limit: Math.min(Math.max(input.limit ?? 25, 1), 100),
    });
  }
}
