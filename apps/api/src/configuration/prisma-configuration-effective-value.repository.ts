import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import {
  ConfigurationEffectiveValueRepository,
  type PublishedConfigurationValueRecord,
} from './configuration-effective-value.repository.js';

@Injectable()
export class PrismaConfigurationEffectiveValueRepository extends ConfigurationEffectiveValueRepository {
  constructor(private readonly database: DatabaseService) { super(); }

  async findPublishedValues(settingKey: string): Promise<readonly PublishedConfigurationValueRecord[]> {
    const rows = await this.database.configurationValue.findMany({
      where: {
        settingKey,
        version: { status: 'published' },
      },
      select: {
        settingKey: true,
        valueType: true,
        booleanValue: true,
        integerValue: true,
        decimalValue: true,
        textValue: true,
        version: { select: { scope: true } },
      },
    });
    return rows.map((row) => ({
      scope: row.version.scope as PublishedConfigurationValueRecord['scope'],
      settingKey: row.settingKey,
      value: this.fromTypedColumns(row),
    }));
  }

  private fromTypedColumns(row: {
    valueType: string;
    booleanValue: boolean | null;
    integerValue: bigint | null;
    decimalValue: { toNumber(): number } | null;
    textValue: string | null;
  }): PublishedConfigurationValueRecord['value'] {
    switch (row.valueType) {
      case 'boolean':
        if (row.booleanValue === null) break;
        return row.booleanValue;
      case 'integer':
        if (row.integerValue === null) break;
        return row.integerValue;
      case 'decimal':
        if (row.decimalValue === null) break;
        return row.decimalValue.toNumber();
      case 'text':
        if (row.textValue === null) break;
        return row.textValue;
    }
    throw new Error('published configuration value violates typed-column contract');
  }
}
