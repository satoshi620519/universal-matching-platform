import { Injectable } from '@nestjs/common';
import {
  validateDraftConfigurationValue,
  type DraftConfigurationValue,
} from '@universal/domain';
import { ConfigurationSettingDefinitionProvider } from './configuration-setting-definition.provider.js';
import { ConfigurationValueRepository } from './configuration-value.repository.js';
import { ConfigurationVersionRepository } from './configuration-version.repository.js';

@Injectable()
export class ConfigurationDraftEditingService {
  constructor(
    private readonly versions: ConfigurationVersionRepository,
    private readonly definitions: ConfigurationSettingDefinitionProvider,
    private readonly values: ConfigurationValueRepository,
  ) {}

  async setValue(versionId: string, input: DraftConfigurationValue): Promise<void> {
    const draft = await this.versions.findDraft(versionId);
    if (!draft) throw new Error('configuration version is not an editable draft');

    const definition = this.definitions.find(input.settingKey);
    if (!definition) throw new Error('unknown configuration setting');

    validateDraftConfigurationValue(definition, {
      ...input,
      scope: draft.scope,
    });

    await this.values.upsertDraftValue({
      versionId,
      settingKey: input.settingKey,
      valueType: input.valueType,
      value: input.value,
    });
  }
}
