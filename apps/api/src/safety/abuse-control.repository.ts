import type { AbuseControlKey } from '@universal/domain';

export type AbuseControlWindow = Readonly<{ count: number; startedAt: number }>;

export abstract class AbuseControlRepository {
  abstract get(key: AbuseControlKey): Promise<AbuseControlWindow | null>;
  abstract put(key: AbuseControlKey, value: AbuseControlWindow): Promise<void>;
}
