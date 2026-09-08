import { type AnalyticsEventRecord } from '@universal/domain';

export abstract class AnalyticsEventRepository {
  abstract record(event: AnalyticsEventRecord): Promise<void>;
  abstract listRecent(limit: number): Promise<readonly AnalyticsEventRecord[]>;
  abstract listSince(since: Date): Promise<readonly AnalyticsEventRecord[]>;
  abstract hasEventSince(name: string, accountId: string, since: Date): Promise<boolean>;
}
