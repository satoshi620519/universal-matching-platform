import type { PublishedQuickLaunchConfiguration, QuickLaunchDraft } from '@universal/domain';

export interface QuickLaunchConfigurationRecord {
  readonly version: number;
  readonly status: 'draft' | 'published' | 'superseded';
  readonly draft: QuickLaunchDraft;
  readonly published?: PublishedQuickLaunchConfiguration;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export abstract class QuickLaunchConfigurationRepository {
  abstract createDraft(draft: QuickLaunchDraft): Promise<QuickLaunchConfigurationRecord>;
  abstract saveDraft(version: number, draft: QuickLaunchDraft): Promise<QuickLaunchConfigurationRecord>;
  abstract findDraft(version: number): Promise<QuickLaunchConfigurationRecord | undefined>;
  abstract findPublished(): Promise<QuickLaunchConfigurationRecord | undefined>;
  abstract publish(version: number, published: PublishedQuickLaunchConfiguration): Promise<QuickLaunchConfigurationRecord>;
  abstract listHistory(): Promise<readonly QuickLaunchConfigurationRecord[]>;
}
