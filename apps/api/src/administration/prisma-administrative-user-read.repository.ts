import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import {
  AdministrativeUserReadRepository,
  type AdministrativeUserPage,
} from './administrative-user-read.repository.js';

@Injectable()
export class PrismaAdministrativeUserReadRepository extends AdministrativeUserReadRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async list(input: { readonly cursor?: string; readonly limit: number }): Promise<AdministrativeUserPage> {
    const records = await this.database.account.findMany({
      take: input.limit + 1,
      ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      orderBy: { id: 'asc' },
      select: { id: true, status: true, createdAt: true, updatedAt: true },
    });
    const items = records.slice(0, input.limit);
    return {
      items,
      nextCursor: records.length > input.limit ? items.at(-1)?.id ?? null : null,
    };
  }
}
