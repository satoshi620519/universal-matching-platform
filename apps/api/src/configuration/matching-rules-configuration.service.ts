import { Injectable } from '@nestjs/common';
import type { MatchingRulesConfiguration } from '@universal/domain';
import { QuickLaunchConfigurationService } from './quick-launch-configuration.service.js';

/**
 * Resolves purchaser-published matching rules without inventing runtime defaults.
 * Absence is explicit so ranking can safely fall back to non-score ordering.
 */
@Injectable()
export class MatchingRulesConfigurationService {
  constructor(private readonly quickLaunch: QuickLaunchConfigurationService) {}

  async resolve(): Promise<MatchingRulesConfiguration | undefined> {
    return (await this.quickLaunch.findPublished())?.published?.matchingRules;
  }
}
