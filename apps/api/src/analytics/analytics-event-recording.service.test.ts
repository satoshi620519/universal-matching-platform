import { describe, expect, it, vi } from 'vitest';
import { AnalyticsEventRecordingService } from './analytics-event-recording.service.js';
import { AnalyticsEventRepository } from './analytics-event.repository.js';

describe('AnalyticsEventRecordingService', () => {
  it('records a retention check-in with account identity', async () => {
    const recorded: any[] = [];
    const service = new AnalyticsEventRecordingService({ record: async (event: any) => recorded.push(event), hasEventSince: async () => false } as any, { retentionDays: 30, nonEssentialAnalyticsEnabled: true } as any);
    await service.recordRetentionCheckin('account-1', new Date('2026-09-08T00:00:00.000Z'));
    expect(recorded[0]).toMatchObject({ name: 'retention_checkin', dataClassification: 'business', payload: { accountId: 'account-1' } });
  });

  it('does not duplicate a retention check-in within the same UTC day', async () => {
    const record = vi.fn().mockResolvedValue(undefined);
    const hasEventSince = vi.fn().mockResolvedValue(true);
    const service = new AnalyticsEventRecordingService({ record, hasEventSince } as any, { retentionDays: 30, nonEssentialAnalyticsEnabled: true } as any);
    await service.recordRetentionCheckin('account-1', new Date('2026-09-08T12:00:00.000Z'));
    expect(hasEventSince).toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });

  it('records activity with the permitted account identity for distinct-user metrics', async () => {
    const recorded: any[] = [];
    const service = new AnalyticsEventRecordingService({ record: async (event: any) => recorded.push(event) } as any, { retentionDays: 30, nonEssentialAnalyticsEnabled: true } as any);
    await service.recordActivity('account-1', { source: 'authenticated_request' }, new Date('2026-09-08T00:00:00.000Z'));
    expect(recorded[0]).toMatchObject({ name: 'activity', dataClassification: 'business', payload: { accountId: 'account-1', source: 'authenticated_request' } });
  });
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
  it('records a standardized business event', async () => {
    const recorded: unknown[] = [];
    const repository = { record: async (value: unknown) => { recorded.push(value); } } as unknown as AnalyticsEventRepository;
    const service = new AnalyticsEventRecordingService(repository, { retentionDays: 30, nonEssentialAnalyticsEnabled: true });
    await service.recordBusinessEvent('match_created', { category: 'dating' }, new Date('2026-09-07T00:00:00Z'));
    expect(recorded[0]).toMatchObject({ name: 'match_created', version: 1, dataClassification: 'business' });
  });
  it('records a standardized operational event', async () => {
    const recorded: unknown[] = [];
    const repository = { record: async (value: unknown) => { recorded.push(value); } } as unknown as AnalyticsEventRepository;
    const service = new AnalyticsEventRecordingService(repository, { retentionDays: 30, nonEssentialAnalyticsEnabled: false });
    await service.recordOperationalEvent('authenticated_session_started', { source: 'password_sign_in' }, new Date('2026-09-07T00:00:00Z'));
    expect(recorded[0]).toMatchObject({ name: 'authenticated_session_started', version: 1, dataClassification: 'operational', payload: { source: 'password_sign_in' } });
  });
});
