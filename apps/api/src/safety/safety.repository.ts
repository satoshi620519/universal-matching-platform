import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { CreateReportInput } from './safety.types.js';

@Injectable()
export class SafetyRepository {
  constructor(private readonly database: DatabaseService) {}

  async block(input: { blockerAccountId: string; blockedAccountId: string }): Promise<boolean> {
    if (input.blockerAccountId === input.blockedAccountId) throw new Error('Cannot block own account');
    // Schema-independent boundary: persistence adapter will be finalized with the
    // canonical safety migration rather than duplicating ad-hoc storage here.
    return false;
  }

  async createReport(input: CreateReportInput): Promise<void> {
    // Reports require durable evidence retention semantics. Keep this boundary
    // explicit until the canonical Phase 12 migration is introduced.
    void input;
  }
}
