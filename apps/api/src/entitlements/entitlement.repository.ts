import type { EntitlementState } from '@universal/domain';

export interface EntitlementRecord {
  readonly id: string;
  readonly accountId: string;
  readonly entitlementKey: string;
  readonly state: EntitlementState;
  readonly effectiveAt: Date;
  readonly expiresAt: Date | null;
  readonly providerReference: string | null;
  readonly paymentIntentId: string | null;
}

export interface CreateEntitlementInput {
  readonly id: string;
  readonly accountId: string;
  readonly entitlementKey: string;
  readonly state: EntitlementState;
  readonly effectiveAt: Date;
  readonly expiresAt?: Date | null;
  readonly providerReference?: string | null;
  readonly paymentIntentId?: string | null;
}

export abstract class EntitlementRepository {
  abstract create(input: CreateEntitlementInput): Promise<EntitlementRecord>;
  abstract findById(id: string): Promise<EntitlementRecord | null>;
  abstract findByPaymentIntentId(paymentIntentId: string): Promise<EntitlementRecord | null>;
  abstract findByPaymentIntent(
    accountId: string,
    entitlementKey: string,
    paymentIntentId: string,
  ): Promise<EntitlementRecord | null>;
  abstract transition(
    id: string,
    from: EntitlementState,
    to: EntitlementState,
  ): Promise<EntitlementRecord>;
}
