import { Injectable } from '@nestjs/common';
import { SafetyRepository } from './safety.repository.js';
import { CreateReportInput } from './safety.types.js';

@Injectable()
export class SafetyService {
  constructor(private readonly repository: SafetyRepository) {}

  async blockAccount(blockerAccountId: string, blockedAccountId: string): Promise<boolean> {
    return this.repository.block({ blockerAccountId, blockedAccountId });
  }

  async report(input: CreateReportInput): Promise<void> {
    await this.repository.createReport(input);
  }
}
