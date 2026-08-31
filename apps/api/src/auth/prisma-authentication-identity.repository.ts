import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service.js';
import {
  AuthenticationIdentityRepository,
  type AuthenticationIdentityRecord,
  type AuthenticationIdentityStatus,
  type CreateAuthenticationIdentityRecord,
} from './authentication-identity.repository.js';

@Injectable()
export class PrismaAuthenticationIdentityRepository extends AuthenticationIdentityRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async create(
    input: CreateAuthenticationIdentityRecord,
  ): Promise<AuthenticationIdentityRecord> {
    const record = await this.database.authenticationIdentity.create({
      data: {
        ...(input.id ? { id: input.id } : {}),
        accountId: input.accountId,
        providerType: input.providerType,
        providerSubject: input.providerSubject,
        status: input.status ?? 'active',
      },
    });

    return this.toRecord(record);
  }

  async findByProviderIdentity(
    providerType: string,
    providerSubject: string,
  ): Promise<AuthenticationIdentityRecord | null> {
    const record = await this.database.authenticationIdentity.findUnique({
      where: {
        providerType_providerSubject: { providerType, providerSubject },
      },
    });

    return record ? this.toRecord(record) : null;
  }

  async updateStatus(
    id: string,
    status: AuthenticationIdentityStatus,
  ): Promise<AuthenticationIdentityRecord | null> {
    const result = await this.database.authenticationIdentity.updateMany({
      where: { id },
      data: { status },
    });

    if (result.count === 0) {
      return null;
    }

    const record = await this.database.authenticationIdentity.findUnique({
      where: { id },
    });
    return record ? this.toRecord(record) : null;
  }

  private toRecord(record: {
    id: string;
    accountId: string;
    providerType: string;
    providerSubject: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): AuthenticationIdentityRecord {
    return {
      ...record,
      status: record.status as AuthenticationIdentityStatus,
    };
  }
}
