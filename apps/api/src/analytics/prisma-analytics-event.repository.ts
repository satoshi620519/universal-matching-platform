import { Injectable } from '@nestjs/common';
import { isValidAnalyticsEventRecord, type AnalyticsEventRecord } from '@universal/domain';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service.js';
import { AnalyticsEventRepository } from './analytics-event.repository.js';

@Injectable()
export class PrismaAnalyticsEventRepository extends AnalyticsEventRepository {
  constructor(private readonly database: DatabaseService) { super(); }
  async listSince(since: Date): Promise<readonly AnalyticsEventRecord[]> {
    const records = await this.database.analyticsEvent.findMany({ where: { occurredAt: { gte: since } }, orderBy: [{ occurredAt: 'desc' }, { id: 'desc' }] });
    return records.map(record => ({ name: record.name, version: record.version, occurredAt: record.occurredAt, dataClassification: record.dataClassification as AnalyticsEventRecord['dataClassification'], payload: record.payload as Record<string, unknown> }));
  }

  async hasEventSince(name: string, accountId: string, since: Date): Promise<boolean> {
    const record = await this.database.analyticsEvent.findFirst({ where: { name, occurredAt: { gte: since }, payload: { path: ['accountId'], equals: accountId } } });
    return Boolean(record);
  }

  async listRecent(limit: number): Promise<readonly AnalyticsEventRecord[]> {
    const records = await this.database.analyticsEvent.findMany({ take: limit, orderBy: [{ occurredAt: 'desc' }, { id: 'desc' }] });
    return records.map(record => ({ name: record.name, version: record.version, occurredAt: record.occurredAt, dataClassification: record.dataClassification as AnalyticsEventRecord['dataClassification'], payload: record.payload as Record<string, unknown> }));
  }

  async record(event: AnalyticsEventRecord): Promise<void> {
    if (!isValidAnalyticsEventRecord(event)) {
      throw new Error('Invalid or privacy-unsafe analytics event');
    }
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
