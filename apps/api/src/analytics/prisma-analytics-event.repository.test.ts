import { describe, expect, it } from 'vitest';
import { PrismaAnalyticsEventRepository } from './prisma-analytics-event.repository.js';

describe('PrismaAnalyticsEventRepository', () => {
  it('persists only the event contract fields', async () => {
    const calls: unknown[] = [];
    const database = { analyticsEvent: { create: async (args: unknown) => { calls.push(args); }, findMany: async () => [] } };
    const repository = new PrismaAnalyticsEventRepository(database as never);
    await repository.record({ name: 'match_created', version: 1, occurredAt: new Date('2026-09-07T00:00:00Z'), dataClassification: 'operational', payload: { category: 'dating' } });
    expect(calls).toHaveLength(1);
  });
});
