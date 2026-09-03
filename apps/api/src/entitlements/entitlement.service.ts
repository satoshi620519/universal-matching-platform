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

  async findUsable(accountId: string, entitlementKey: string, now = new Date()): Promise<EntitlementRecord | null> {
    return this.repository.findUsableForAccount(accountId, entitlementKey, now);
  }

  async revokeByPaymentIntent(paymentIntentId: string): Promise<EntitlementRecord | null> {
    const record = await this.repository.findByPaymentIntentId(paymentIntentId);
    return record ? this.transition(record, 'revoked') : null;
  }

  async revoke(id: string): Promise<EntitlementRecord> {
    const record = await this.repository.findById(id);
    if (!record) throw new Error(`entitlement not found: ${id}`);
    return this.transition(record, 'revoked');
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
