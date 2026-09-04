import { Injectable } from '@nestjs/common';
import { CreateEnforcementInput, PrismaSafetyRepository } from './prisma-safety.repository.js';
import { CreateSafetyReportInput } from './safety.types.js';

@Injectable()
export class SafetyService {
  constructor(private readonly repository: PrismaSafetyRepository) {}

  async report(input: CreateSafetyReportInput) {
    return this.repository.createReport(input);
  }

  async enforce(input: CreateEnforcementInput) {
    return this.repository.createEnforcement(input);
  }
}
