export type DataClassification = 'operational' | 'business' | 'sensitive';

export interface AnalyticsEventDefinition {
  readonly name: string;
  readonly version: number;
  readonly purpose: string;
  readonly fields: readonly string[];
  readonly dataClassification: DataClassification;
  readonly retentionDays?: number;
}

export interface AnalyticsEventRecord {
  readonly name: string;
  readonly version: number;
  readonly occurredAt: Date;
  readonly dataClassification: DataClassification;
  readonly payload: Readonly<Record<string, unknown>>;
}

export function isValidAnalyticsEventDefinition(definition: AnalyticsEventDefinition): boolean {
  return /^[a-z][a-z0-9_]*$/.test(definition.name) && Number.isInteger(definition.version) && definition.version > 0 && definition.purpose.trim().length > 0 && definition.fields.length > 0 && (definition.retentionDays === undefined || (Number.isInteger(definition.retentionDays) && definition.retentionDays > 0));
}

export function isValidAnalyticsEventRecord(event: AnalyticsEventRecord): boolean {
  return /^[a-z][a-z0-9_]*$/.test(event.name) && Number.isInteger(event.version) && event.version > 0 && event.occurredAt instanceof Date && !Number.isNaN(event.occurredAt.getTime()) && hasPrivacySafeAnalyticsPayload(event.payload);
}


const forbiddenAnalyticsPayloadField = /(?:^|_)(?:password|credential|secret|token|message_body|body|biography|bio|latitude|longitude|coordinate|verification|report_evidence|evidence)(?:$|_)/i;

export function hasPrivacySafeAnalyticsPayload(
  payload: Readonly<Record<string, unknown>>,
): boolean {
  return Object.entries(payload).every(([key, value]) => {
    if (forbiddenAnalyticsPayloadField.test(key)) return false;
    if (value !== null && typeof value === 'object') return false;
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null;
  });
}
