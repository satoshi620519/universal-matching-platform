import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service.js';
import {
  ConfigurationValueRepository,
  type DraftConfigurationValueRecord,
} from './configuration-value.repository.js';

@Injectable()
export class PrismaConfigurationValueRepository extends ConfigurationValueRepository {
  constructor(private readonly database: DatabaseService) { super(); }

  async upsertDraftValue(value: DraftConfigurationValueRecord): Promise<void> {
    const data = this.toTypedColumns(value);
    await this.database.configurationValue.upsert({
      where: { configurationVersionId_settingKey: {
        configurationVersionId: value.versionId, settingKey: value.settingKey,
      } },
      create: { configurationVersionId: value.versionId, settingKey: value.settingKey, ...data },
      update: data,
    });
  }

  private toTypedColumns(value: DraftConfigurationValueRecord) {
    const empty = { booleanValue: null, integerValue: null, decimalValue: null, textValue: null };
    switch (value.valueType) {
      case 'boolean': return { valueType: value.valueType, ...empty, booleanValue: value.value as boolean };
      case 'integer': return { valueType: value.valueType, ...empty, integerValue: value.value as bigint };
      case 'decimal': return { valueType: value.valueType, ...empty, decimalValue: new Prisma.Decimal(value.value as number) };
      case 'text': return { valueType: value.valueType, ...empty, textValue: value.value as string };
    }
  }
}
