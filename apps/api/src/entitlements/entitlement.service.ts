import { randomUUID } from 'node:crypto';
import {
  canTransitionEntitlementState,
  type EntitlementState,
} from '@universal/domain';
import {
  EntitlementRepository,
  type EntitlementRecord,
} from './entitlement.repository.js';

export interface GrantEntitlementInput {
  readonly accountId: string;
  readonly entitlementKey: string;
  readonly paymentIntentId: string;
  readonly providerReference: string;
  readonly effectiveAt?: Date;
  readonly expiresAt?: Date | null;
}

export class EntitlementService {
  constructor(private readonly repository: EntitlementRepository) {}

  async grant(input: GrantEntitlementInput): Promise<EntitlementRecord> {
    const existing = await this.repository.findByPaymentIntent(
      input.accountId,
      input.entitlementKey,
      input.paymentIntentId,
    );

    if (existing) {
      return existing.state === 'pending'
        ? this.transition(existing, 'active')
        : existing;
    }

    return this.repository.create({
      id: randomUUID(),
      accountId: input.accountId,
      entitlementKey: input.entitlementKey,
      state: 'active',
      effectiveAt: input.effectiveAt ?? new Date(),
      expiresAt: input.expiresAt ?? null,
      providerReference: input.providerReference,
      paymentIntentId: input.paymentIntentId,
    });
  }

  async revoke(id: string, state: EntitlementState): Promise<EntitlementRecord> {
    return this.transition({ id, state } as EntitlementRecord, 'revoked');
  }

  private transition(
    record: EntitlementRecord,
    to: EntitlementState,
  ): Promise<EntitlementRecord> {
    if (!canTransitionEntitlementState(record.state, to)) {
      throw new Error(`invalid entitlement transition: ${record.state} -> ${to}`);
    }
    return this.repository.transition(record.id, record.state, to);
  }
}
