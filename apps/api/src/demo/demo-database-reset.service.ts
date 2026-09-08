import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class DemoDatabaseResetService {
  constructor(private readonly database: DatabaseService) {}

  async clear(): Promise<void> {
    await this.database.$transaction(async (tx) => {
      const ids = [
        '00000000-0000-4000-8000-0000000000a1',
        '00000000-0000-4000-8000-0000000000b2',
        '00000000-0000-4000-8000-0000000000c3',
        '00000000-0000-4000-8000-0000000000d4',
      ];

      await tx.account.deleteMany({ where: { id: { in: ids } } });
    });
  }
}
