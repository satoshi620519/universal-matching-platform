import { Injectable } from '@nestjs/common';
import { AdministrativeCapabilityAccessService } from './administrative-capability-access.service.js';
import { AdministrativeMatchReadRepository } from './administrative-match-read.repository.js';

@Injectable()
export class AdministrativeMatchReadService {
  constructor(private readonly access: AdministrativeCapabilityAccessService, private readonly matches: AdministrativeMatchReadRepository) {}
  async list(input: { readonly accountId: string; readonly cursor?: string; readonly limit?: number }) {
    await this.access.require(input.accountId, 'view-dashboard');
    return this.matches.list({ cursor: input.cursor, limit: Math.min(Math.max(input.limit ?? 25, 1), 100) });
  }
}
