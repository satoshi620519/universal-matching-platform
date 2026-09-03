import { Injectable } from '@nestjs/common';
import {
  publishQuickLaunchConfiguration,
  type QuickLaunchDraft,
  type PublishedQuickLaunchConfiguration,
} from '@universal/domain';
import {
  QuickLaunchConfigurationRepository,
  type QuickLaunchConfigurationRecord,
} from './quick-launch-configuration.repository.js';

@Injectable()
export class QuickLaunchConfigurationService {
  constructor(private readonly repository: QuickLaunchConfigurationRepository) {}

  createDraft(draft: QuickLaunchDraft): Promise<QuickLaunchConfigurationRecord> {
    return this.repository.createDraft(draft);
  }

  saveDraft(version: number, draft: QuickLaunchDraft): Promise<QuickLaunchConfigurationRecord> {
    return this.repository.saveDraft(version, draft);
  }

  async publish(version: number, publishedAt = new Date()): Promise<QuickLaunchConfigurationRecord> {
    const record = await this.repository.findDraft(version);
    if (!record || record.status !== 'draft') throw new Error('quick launch draft is not publishable');
    const published = publishQuickLaunchConfiguration(record.draft, version, publishedAt.toISOString());
    return this.repository.publish(version, published);
  }

  findPublished(): Promise<QuickLaunchConfigurationRecord | undefined> {
    return this.repository.findPublished();
  }

  listHistory(): Promise<readonly QuickLaunchConfigurationRecord[]> {
    return this.repository.listHistory();
  }
}
