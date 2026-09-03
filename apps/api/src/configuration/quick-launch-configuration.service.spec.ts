import { describe, expect, it } from 'vitest';
import type { PublishedQuickLaunchConfiguration, QuickLaunchDraft } from '@universal/domain';
import { QuickLaunchConfigurationService } from './quick-launch-configuration.service.js';
import { QuickLaunchConfigurationRepository, type QuickLaunchConfigurationRecord } from './quick-launch-configuration.repository.js';

const draft: QuickLaunchDraft = {
  applicationName: 'Lifecycle Demo',
  primaryColor: '#123456',
  supportedCountries: ['JP'],
  categories: [{ key: 'dating', displayName: 'Dating' }],
  enabledFeatures: ['matching'],
  onboarding: [{ field: 'displayName', required: true }],
};

class MemoryRepository extends QuickLaunchConfigurationRepository {
  records: QuickLaunchConfigurationRecord[] = [];
  async createDraft(value: QuickLaunchDraft) { const record: QuickLaunchConfigurationRecord = { version: this.records.length + 1, status: 'draft', draft: value, createdAt: new Date(), updatedAt: new Date() }; this.records.push(record); return record; }
  async saveDraft(version: number, value: QuickLaunchDraft) { const record = await this.findDraft(version); if (!record) throw new Error('missing draft'); Object.assign(record as object, { draft: value, updatedAt: new Date() }); return record; }
  async findDraft(version: number) { return this.records.find(x => x.version === version && x.status === 'draft'); }
  async findPublished() { return [...this.records].reverse().find(x => x.status === 'published'); }
  async publish(version: number, published: PublishedQuickLaunchConfiguration) { for (const record of this.records) if (record.status === 'published') (record as any).status = 'superseded'; const record = this.records.find(x => x.version === version)!; (record as any).status = 'published'; (record as any).published = published; return record; }
  async listHistory() { return this.records; }
}

describe('Quick Launch configuration lifecycle', () => {
  it('publishes localization using the existing supportedCountries source without duplicate country storage', async () => {
    const repository = new MemoryRepository();
    const service = new QuickLaunchConfigurationService(repository);
    const created = await service.createDraft({ ...draft, supportedCountries: ['JP', 'US'], localization: { defaultLocale: 'en', supportedLocales: ['en', 'ja-JP'], countryLocales: { JP: 'ja-JP', US: 'en' } } });
    const published = await service.publish(created.version, new Date('2026-01-01T00:00:00.000Z'));
    expect(published.published?.supportedCountries).toEqual(['JP', 'US']);
    expect(published.published?.localization).toMatchObject({ defaultLocale: 'en', countryLocales: { JP: 'ja-JP' } });
  });

  it('publishes branding/theme extensions as immutable snapshots while retaining legacy fields', async () => {
    const repository = new MemoryRepository();
    const service = new QuickLaunchConfigurationService(repository);
    const created = await service.createDraft({ ...draft, brandingTheme: { primaryColor: '#123456', secondaryColor: '#654321', typography: { fontFamily: 'Inter', borderRadius: 'medium' } } });
    const published = await service.publish(created.version, new Date('2026-01-01T00:00:00.000Z'));
    expect(published.published?.brandingTheme).toMatchObject({ secondaryColor: '#654321', typography: { fontFamily: 'Inter', borderRadius: 'medium' } });
    expect(published.published?.primaryColor).toBe('#123456');
  });

  it('creates, saves, publishes, retrieves current configuration and preserves history', async () => {
    const repository = new MemoryRepository();
    const service = new QuickLaunchConfigurationService(repository);
    const created = await service.createDraft(draft);
    const saved = await service.saveDraft(created.version, { ...draft, applicationName: 'Updated Demo' });
    const published = await service.publish(saved.version, new Date('2026-01-01T00:00:00.000Z'));
    expect(published.status).toBe('published');
    expect((await service.findPublished())?.version).toBe(created.version);
    expect((await service.listHistory()).map(x => x.version)).toEqual([created.version]);
  });

  it('supersedes the previous publication while preserving immutable history', async () => {
    const repository = new MemoryRepository();
    const service = new QuickLaunchConfigurationService(repository);
    const first = await service.createDraft(draft);
    await service.publish(first.version, new Date('2026-01-01T00:00:00.000Z'));
    const second = await service.createDraft({ ...draft, applicationName: 'Second Launch' });
    await service.publish(second.version, new Date('2026-01-02T00:00:00.000Z'));
    expect((await service.findPublished())?.version).toBe(second.version);
    expect((await service.listHistory()).map(x => [x.version, x.status])).toEqual([[first.version, 'superseded'], [second.version, 'published']]);
  });

  it('rejects publishing a missing or non-draft version', async () => {
    const service = new QuickLaunchConfigurationService(new MemoryRepository());
    await expect(service.publish(999)).rejects.toThrow('not publishable');
  });
});
