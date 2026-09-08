import { BadRequestException, Injectable } from '@nestjs/common';
import { isValidAnalyticsEventRecord, shouldCollectNonEssentialAnalytics, type AnalyticsDeploymentPolicy, type AnalyticsEventRecord } from '@universal/domain';
import { AnalyticsEventRepository } from './analytics-event.repository.js';

@Injectable()
export class AnalyticsEventRecordingService {
  constructor(private readonly repository: AnalyticsEventRepository, private readonly policy: AnalyticsDeploymentPolicy) {}

  async record(event: AnalyticsEventRecord): Promise<void> {
    if (!isValidAnalyticsEventRecord(event)) throw new BadRequestException('Invalid analytics event');
    if (event.dataClassification !== 'operational' && !shouldCollectNonEssentialAnalytics(this.policy)) return;
    await this.repository.record(event);
  }

  async recordActivity(accountId: string, payload: Readonly<Record<string, unknown>> = {}, now = new Date()): Promise<void> {
    await this.record({ name: 'activity', version: 1, occurredAt: now, dataClassification: 'business', payload: { ...payload, accountId } });
  }

  async recordBusinessEvent(name: string, payload: Readonly<Record<string, unknown>> = {}, now = new Date()): Promise<void> {
    await this.record({ name, version: 1, occurredAt: now, dataClassification: 'business', payload });
  }

  async recordOperationalEvent(name: string, payload: Readonly<Record<string, unknown>> = {}, now = new Date()): Promise<void> {
    await this.record({ name, version: 1, occurredAt: now, dataClassification: 'operational', payload });
  }
}
