import { describe, expect, it } from 'vitest';
import { EntitlementService } from './entitlement.service.js';
import {
  EntitlementRepository,
  type CreateEntitlementInput,
  type EntitlementRecord,
} from './entitlement.repository.js';

class InMemoryEntitlementRepository extends EntitlementRepository {
  readonly records = new Map<string, EntitlementRecord>();

  async create(input: CreateEntitlementInput): Promise<EntitlementRecord> {
    const record: EntitlementRecord = {
      id: input.id,
      accountId: input.accountId,
      entitlementKey: input.entitlementKey,
      state: input.state,
      effectiveAt: input.effectiveAt,
      expiresAt: input.expiresAt ?? null,
      providerReference: input.providerReference ?? null,
      paymentIntentId: input.paymentIntentId ?? null,
    };
    this.records.set(record.id, record);
    return record;
  }

  async findById(id: string): Promise<EntitlementRecord | null> {
    return this.records.get(id) ?? null;
  }

  async findByPaymentIntentId(paymentIntentId: string): Promise<EntitlementRecord | null> {
    return [...this.records.values()].find((record) => record.paymentIntentId === paymentIntentId) ?? null;
  }

  async findByPaymentIntent(
    accountId: string,
    entitlementKey: string,
    paymentIntentId: string,
  ): Promise<EntitlementRecord | null> {
    return [...this.records.values()].find(
      (record) =>
        record.accountId === accountId &&
        record.entitlementKey === entitlementKey &&
        record.paymentIntentId === paymentIntentId,
    ) ?? null;
  }

  async findUsableForAccount(accountId: string, entitlementKey: string, now: Date): Promise<EntitlementRecord | null> {
    return [...this.records.values()].find(
      (record) =>
        record.accountId === accountId &&
        record.entitlementKey === entitlementKey &&
        (record.state === 'active' || record.state === 'scheduled-expiration') &&
        record.effectiveAt <= now &&
        (!record.expiresAt || record.expiresAt > now),
    ) ?? null;
  }

  async transition(
    id: string,
    from: EntitlementRecord['state'],
    to: EntitlementRecord['state'],
  ): Promise<EntitlementRecord> {
    const current = this.records.get(id);
    if (!current || current.state !== from) throw new Error('stale entitlement state');
    const next = { ...current, state: to };
    this.records.set(id, next);
    return next;
  }
}

describe('EntitlementService', () => {
  it('grants once and makes duplicate payment success idempotent', async () => {
    const repository = new InMemoryEntitlementRepository();
    const service = new EntitlementService(repository);
    const input = {
      accountId: 'account-1',
      entitlementKey: 'premium',
      paymentIntentId: 'intent-1',
      providerReference: 'provider:intent-1',
      effectiveAt: new Date('2026-09-03T00:00:00Z'),
    };

    const first = await service.grant(input);
    const duplicate = await service.grant(input);

    expect(first.id).toBe(duplicate.id);
    expect(duplicate.state).toBe('active');
    expect(repository.records.size).toBe(1);
  });

  it('promotes a pending entitlement to active', async () => {
    const repository = new InMemoryEntitlementRepository();
    await repository.create({
      id: 'entitlement-1',
      accountId: 'account-1',
      entitlementKey: 'premium',
      state: 'pending',
      effectiveAt: new Date('2026-09-03T00:00:00Z'),
      paymentIntentId: 'intent-1',
      providerReference: 'provider:intent-1',
    });
    const service = new EntitlementService(repository);

    const result = await service.grant({
      accountId: 'account-1',
      entitlementKey: 'premium',
      paymentIntentId: 'intent-1',
      providerReference: 'provider:intent-1',
    });

    expect(result.state).toBe('active');
  });

  it('revokes only the entitlement explicitly linked to a payment intent', async () => {
    const repository = new InMemoryEntitlementRepository();
    const service = new EntitlementService(repository);
    const first = await service.grant({ accountId: 'account-1', entitlementKey: 'premium', paymentIntentId: 'intent-a', providerReference: 'ref-a' });
    const second = await service.grant({ accountId: 'account-2', entitlementKey: 'premium', paymentIntentId: 'intent-b', providerReference: 'ref-b' });
    const revoked = await service.revokeByPaymentIntent('intent-a');
    expect(revoked?.id).toBe(first.id);
    expect((await repository.findById(second.id))?.state).toBe('active');
  });

  it('revokes an active entitlement and rejects revocation after terminal state', async () => {
    const repository = new InMemoryEntitlementRepository();
    const service = new EntitlementService(repository);
    const created = await service.grant({
      accountId: 'account-1',
      entitlementKey: 'premium',
      paymentIntentId: 'intent-1',
      providerReference: 'provider:intent-1',
    });

    const revoked = await service.revoke(created.id);
    expect(revoked.state).toBe('revoked');
    await expect(service.revoke(created.id)).rejects.toThrow('invalid entitlement transition');
  });
});
