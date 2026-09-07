import { Injectable } from '@nestjs/common';
import { AdministrativeCapabilityAccessService } from './administrative-capability-access.service.js';
import { AdministrativeModerationReadRepository } from './administrative-moderation-read.repository.js';

@Injectable()
export class AdministrativeModerationReadService {
  constructor(
    private readonly access: AdministrativeCapabilityAccessService,
    private readonly moderation: AdministrativeModerationReadRepository,
  ) {}

  private async authorize(accountId: string) {
    await this.access.require(accountId, 'manage-moderation');
  }

  async listReports(input: { readonly accountId: string; readonly cursor?: string; readonly limit?: number }) {
    await this.authorize(input.accountId);
    return this.moderation.listReports({ cursor: input.cursor, limit: Math.min(Math.max(input.limit ?? 25, 1), 100) });
  }

  async listCases(input: { readonly accountId: string; readonly cursor?: string; readonly limit?: number }) {
    await this.authorize(input.accountId);
    return this.moderation.listCases({ cursor: input.cursor, limit: Math.min(Math.max(input.limit ?? 25, 1), 100) });
  }
}
