import { ForbiddenException, Injectable } from '@nestjs/common';

import { AdministrativeRoleAccessService } from './administrative-role-access.service.js';
import {
  rolesForAdministrativeCapability,
  type AdministrativeCapability,
} from './administrative-capability-policy.js';

@Injectable()
export class AdministrativeCapabilityAccessService {
  constructor(private readonly roles: AdministrativeRoleAccessService) {}

  async can(
    accountId: string,
    capability: AdministrativeCapability,
    now = new Date(),
  ): Promise<boolean> {
    return this.roles.hasAnyRole(
      accountId,
      rolesForAdministrativeCapability(capability),
      now,
    );
  }

  async require(
    accountId: string,
    capability: AdministrativeCapability,
    now = new Date(),
  ): Promise<void> {
    if (!(await this.can(accountId, capability, now))) {
      throw new ForbiddenException('administrative capability is required');
    }
  }
}
