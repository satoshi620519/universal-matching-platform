import { Injectable } from '@nestjs/common';
import type { AdministrativeRoleKey } from '@universal/domain';

import { AdministrativeCapabilityAccessService } from './administrative-capability-access.service.js';
import { RoleAssignmentMutationService } from './role-assignment-mutation.service.js';

@Injectable()
export class AdministrativeRoleManagementService {
  constructor(private readonly access: AdministrativeCapabilityAccessService, private readonly mutation: RoleAssignmentMutationService) {}

  async assign(input: { readonly actorId: string; readonly accountId: string; readonly role: AdministrativeRoleKey; readonly effectiveAt?: Date; readonly expiresAt?: Date; readonly correlationId?: string }): Promise<void> {
    await this.access.require(input.actorId, 'manage-administrative-roles');
    await this.mutation.assign(input);
  }

  async revoke(input: { readonly actorId: string; readonly accountId: string; readonly role: AdministrativeRoleKey; readonly revokedAt?: Date; readonly correlationId?: string }): Promise<boolean> {
    await this.access.require(input.actorId, 'manage-administrative-roles');
    return this.mutation.revoke(input);
  }
}
