import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { AdministrativeProfileReadRepository, type AdministrativeProfilePage } from './administrative-profile-read.repository.js';

@Injectable()
export class PrismaAdministrativeProfileReadRepository extends AdministrativeProfileReadRepository {
  constructor(private readonly database: DatabaseService) { super(); }

  async list(input: { readonly cursor?: string; readonly limit: number }): Promise<AdministrativeProfilePage> {
    const records = await this.database.profile.findMany({
      take: input.limit + 1,
      ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      orderBy: { id: 'asc' },
      select: {
        id: true, accountId: true, categoryId: true, scopeKind: true,
        verificationStatus: true, avatarStatus: true, createdAt: true, updatedAt: true,
      },
    });
    const items = records.slice(0, input.limit);
    return { items, nextCursor: records.length > input.limit ? items.at(-1)?.id ?? null : null };
  }
}
