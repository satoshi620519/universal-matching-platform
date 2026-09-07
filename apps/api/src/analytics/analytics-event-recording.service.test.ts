import { describe, expect, it } from 'vitest';
import { AnalyticsEventRecordingService } from './analytics-event-recording.service.js';
import { AnalyticsEventRepository } from './analytics-event.repository.js';

describe('AnalyticsEventRecordingService', () => {
  const event = { name: 'match_created', version: 1, occurredAt: new Date('2026-09-07T00:00:00Z'), dataClassification: 'business' as const, payload: { category: 'dating' } };
  it('does not persist non-essential events when disabled', async () => {
    const repository = { record: async () => { throw new Error('must not persist'); } } as unknown as AnalyticsEventRepository;
    const service = new AnalyticsEventRecordingService(repository, { retentionDays: 30, nonEssentialAnalyticsEnabled: false });
    await expect(service.record(event)).resolves.toBeUndefined();
  });
  it('rejects malformed events before persistence', async () => {
    const repository = { record: async () => { throw new Error('must not persist'); } } as unknown as AnalyticsEventRepository;
    const service = new AnalyticsEventRecordingService(repository, { retentionDays: 30, nonEssentialAnalyticsEnabled: true });
    await expect(service.record({ name: 'Invalid Name', version: 0, occurredAt: new Date('invalid'), dataClassification: 'business', payload: {} })).rejects.toThrow('Invalid analytics event');
  });

  it('persists operational events even when non-essential analytics is disabled', async () => {
    const recorded: unknown[] = [];
    const repository = { record: async (value: unknown) => { recorded.push(value); } } as unknown as AnalyticsEventRepository;
    const service = new AnalyticsEventRecordingService(repository, { retentionDays: 30, nonEssentialAnalyticsEnabled: false });
    await service.record({ ...event, dataClassification: 'operational' });
    expect(recorded).toHaveLength(1);
  });
});
