import { describe, expect, it } from 'vitest';
import type { QuickLaunchDraft } from '@universal/domain';
import { QuickLaunchConfigurationRepository, type QuickLaunchConfigurationRecord } from './quick-launch-configuration.repository.js';
import { QuickLaunchConfigurationService } from './quick-launch-configuration.service.js';

const draft: QuickLaunchDraft = {
  applicationName: 'Launch',
  primaryColor: '#123456',
  supportedCountries: ['JP'],
  categories: [{ key: 'dating', displayName: 'Dating' }],
  enabledFeatures: ['matching'],
  onboarding: [{ field: 'displayName', required: true }],
};

class InMemoryRepository extends QuickLaunchConfigurationRepository {
  private records: QuickLaunchConfigurationRecord[] = [];
  async createDraft(value: QuickLaunchDraft) {
    const record: QuickLaunchConfigurationRecord = { version: this.records.length + 1, status: 'draft', draft: value, createdAt: new Date(), updatedAt: new Date() };
    this.records.push(record); return record;
  }
  async saveDraft(version: number, value: QuickLaunchDraft) {
    const record = await this.findDraft(version); if (!record) throw new Error('draft not found');
    const next = { ...record, draft: value, updatedAt: new Date() }; this.records = this.records.map((item) => item.version === version ? next : item); return next;
  }
  async findDraft(version: number) { return this.records.find((record) => record.version === version && record.status === 'draft'); }
  async findPublished() { return this.records.find((record) => record.status === 'published'); }
  async publish(version: number, published: NonNullable<QuickLaunchConfigurationRecord['published']>) {
    this.records = this.records.map((record) => record.status === 'published' ? { ...record, status: 'superseded' as const } : record);
    const current = this.records.find((record) => record.version === version && record.status === 'draft'); if (!current) throw new Error('draft not found');
    const next = { ...current, status: 'published' as const, published, updatedAt: new Date() };
    this.records = this.records.map((record) => record.version === version ? next : record); return next;
  }
  async listHistory() { return [...this.records]; }
}

describe('QuickLaunchConfigurationService', () => {
  it('publishes an immutable snapshot and supersedes previous publication without mutating history', async () => {
    const repository = new InMemoryRepository();
    const service = new QuickLaunchConfigurationService(repository);
    const first = await service.createDraft(draft);
    await service.publish(first.version, new Date('2026-09-03T00:00:00.000Z'));
    const second = await service.createDraft({ ...draft, applicationName: 'Launch Two' });
    await service.publish(second.version, new Date('2026-09-04T00:00:00.000Z'));
    const history = await service.listHistory();
    expect(history.map((item) => item.status)).toEqual(['superseded', 'published']);
    expect(history[0]?.published?.applicationName).toBe('Launch');
    expect(history[1]?.published?.applicationName).toBe('Launch Two');
  });
});
