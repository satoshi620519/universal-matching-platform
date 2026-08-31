import { Injectable } from '@nestjs/common';
import { AccountRepository, AccountRecord, CreateAccountRecord } from './account.repository.js';
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

    return record;
  }

  async findById(id: string): Promise<AccountRecord | null> {
    return this.database.account.findUnique({ where: { id } });
  }
}
