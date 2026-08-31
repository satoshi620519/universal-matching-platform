export type DataClassification = 'operational' | 'business' | 'sensitive';

export interface AnalyticsEventDefinition {
  readonly name: string;
  readonly version: number;
  readonly purpose: string;
  readonly fields: readonly string[];
  readonly dataClassification: DataClassification;
  readonly retentionDays?: number;
}

export function isValidAnalyticsEventDefinition(
  definition: AnalyticsEventDefinition,
): boolean {
  return (
    /^[a-z][a-z0-9_]*$/.test(definition.name) &&
    Number.isInteger(definition.version) &&
    definition.version > 0 &&
    definition.purpose.trim().length > 0 &&
    definition.fields.length > 0 &&
    (definition.retentionDays === undefined ||
      (Number.isInteger(definition.retentionDays) && definition.retentionDays > 0))
  );
}
