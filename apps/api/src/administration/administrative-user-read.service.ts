import { Injectable } from '@nestjs/common';
import { AdministrativeCapabilityAccessService } from './administrative-capability-access.service.js';
import { AdministrativeUserReadRepository, type AdministrativeUserPage } from './administrative-user-read.repository.js';

@Injectable()
export class AdministrativeUserReadService {
  constructor(
    private readonly capabilityAccess: AdministrativeCapabilityAccessService,
    private readonly users: AdministrativeUserReadRepository,
  ) {}

  async list(input: {
    readonly accountId: string;
    readonly cursor?: string;
    readonly limit?: number;
  }): Promise<AdministrativeUserPage> {
    await this.capabilityAccess.requireCapability(input.accountId, 'view-dashboard');
    const limit = Math.min(Math.max(input.limit ?? 25, 1), 100);
    return this.users.list({ cursor: input.cursor, limit });
  }
}
