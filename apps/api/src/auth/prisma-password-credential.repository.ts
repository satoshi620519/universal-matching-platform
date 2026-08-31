import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service.js';
import {
  PasswordCredentialRepository,
  type CreatePasswordCredentialRecord,
  type PasswordCredentialRecord,
  type PasswordCredentialStatus,
} from './password-credential.repository.js';

@Injectable()
export class PrismaPasswordCredentialRepository extends PasswordCredentialRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async create(
    input: CreatePasswordCredentialRecord,
  ): Promise<PasswordCredentialRecord> {
    const record = await this.database.passwordCredential.create({
      data: {
        authenticationIdentityId: input.authenticationIdentityId,
        passwordHash: input.passwordHash,
        status: input.status ?? 'active',
      },
    });

    return this.toRecord(record);
  }

  async findByAuthenticationIdentityId(
    authenticationIdentityId: string,
  ): Promise<PasswordCredentialRecord | null> {
    const record = await this.database.passwordCredential.findUnique({
      where: { authenticationIdentityId },
    });

    return record ? this.toRecord(record) : null;
  }

  async replacePasswordHash(
    authenticationIdentityId: string,
    passwordHash: string,
  ): Promise<PasswordCredentialRecord | null> {
    const result = await this.database.passwordCredential.updateMany({
      where: { authenticationIdentityId },
      data: { passwordHash },
    });

    if (result.count === 0) {
      return null;
    }

    const record = await this.database.passwordCredential.findUnique({
      where: { authenticationIdentityId },
    });
    return record ? this.toRecord(record) : null;
  }

  async updateStatus(
    authenticationIdentityId: string,
    status: PasswordCredentialStatus,
  ): Promise<PasswordCredentialRecord | null> {
    const result = await this.database.passwordCredential.updateMany({
      where: { authenticationIdentityId },
      data: { status },
    });

    if (result.count === 0) {
      return null;
    }

    const record = await this.database.passwordCredential.findUnique({
      where: { authenticationIdentityId },
    });
    return record ? this.toRecord(record) : null;
  }

  private toRecord(record: {
    authenticationIdentityId: string;
    passwordHash: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): PasswordCredentialRecord {
    return {
      ...record,
      status: record.status as PasswordCredentialStatus,
    };
  }
}
