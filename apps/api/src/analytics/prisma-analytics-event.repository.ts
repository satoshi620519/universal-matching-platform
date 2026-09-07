import { Injectable } from '@nestjs/common';
import { type AnalyticsEventRecord } from '@universal/domain';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service.js';
import { AnalyticsEventRepository } from './analytics-event.repository.js';

@Injectable()
export class PrismaAnalyticsEventRepository extends AnalyticsEventRepository {
  constructor(private readonly database: DatabaseService) { super(); }
  async record(event: AnalyticsEventRecord): Promise<void> {
    await this.database.analyticsEvent.create({
      data: {
        id: randomUUID(),
        name: event.name,
        version: event.version,
        occurredAt: event.occurredAt,
        dataClassification: event.dataClassification,
        payload: event.payload as object,
      },
    });
  }
}
