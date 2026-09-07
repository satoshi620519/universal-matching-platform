import { Injectable } from '@nestjs/common';
import { AdministrativeCapabilityAccessService } from './administrative-capability-access.service.js';
import { AdministrativeProfileReadRepository, type AdministrativeProfilePage } from './administrative-profile-read.repository.js';

@Injectable()
export class AdministrativeProfileReadService {
  constructor(
    private readonly capabilityAccess: AdministrativeCapabilityAccessService,
    private readonly profiles: AdministrativeProfileReadRepository,
  ) {}

  async list(input: { readonly accountId: string; readonly cursor?: string; readonly limit?: number }): Promise<AdministrativeProfilePage> {
    await this.capabilityAccess.require(input.accountId, 'view-dashboard');
    const limit = Math.min(Math.max(input.limit ?? 25, 1), 100);
    return this.profiles.list({ cursor: input.cursor, limit });
  }
}
