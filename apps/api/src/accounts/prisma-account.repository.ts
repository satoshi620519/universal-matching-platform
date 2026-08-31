import { Injectable } from '@nestjs/common';
import type { AccountState } from '@universal/domain';
import {
  AccountRepository,
  AccountRecord,
  CreateAccountRecord,
} from './account.repository.js';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(input: CreateAccountRecord): Promise<AccountRecord> {
    const record = await this.database.account.create({
      data: {
        ...(input.id ? { id: input.id } : {}),
        status: input.status,
      },
    });

    return this.toAccountRecord(record);
  }

  async findById(id: string): Promise<AccountRecord | null> {
    const record = await this.database.account.findUnique({ where: { id } });
    return record ? this.toAccountRecord(record) : null;
  }

  private toAccountRecord(record: {
    id: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): AccountRecord {
    return {
      ...record,
      status: record.status as AccountState,
    };
  }
}
