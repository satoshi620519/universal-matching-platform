import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { EntitlementState } from '@universal/domain';
import { DatabaseService } from '../database/database.service.js';
import {
  EntitlementRepository,
  type CreateEntitlementInput,
  type EntitlementRecord,
} from './entitlement.repository.js';

interface EntitlementRow {
  id: string;
  account_id: string;
  entitlement_key: string;
  state: string;
  effective_at: Date;
  expires_at: Date | null;
  provider_reference: string | null;
  payment_intent_id: string | null;
}

@Injectable()
export class PrismaEntitlementRepository extends EntitlementRepository {
  constructor(private readonly database: DatabaseService) { super(); }

  async create(input: CreateEntitlementInput): Promise<EntitlementRecord> {
    const rows = await this.database.$queryRaw<EntitlementRow[]>(Prisma.sql`
      INSERT INTO entitlements
        (id, account_id, entitlement_key, state, effective_at, expires_at, provider_reference, payment_intent_id)
      VALUES
        (${input.id}::uuid, ${input.accountId}::uuid, ${input.entitlementKey}, ${input.state}, ${input.effectiveAt}, ${input.expiresAt ?? null}, ${input.providerReference ?? null}, ${input.paymentIntentId ?? null})
      RETURNING id, account_id, entitlement_key, state, effective_at, expires_at, provider_reference, payment_intent_id
    `);
    return this.toRecord(rows[0]);
  }

  async findById(id: string): Promise<EntitlementRecord | null> {
    const rows = await this.database.$queryRaw<EntitlementRow[]>(Prisma.sql`
      SELECT id, account_id, entitlement_key, state, effective_at, expires_at, provider_reference, payment_intent_id
      FROM entitlements WHERE id = ${id}::uuid
    `);
    return rows[0] ? this.toRecord(rows[0]) : null;
  }

  async findByPaymentIntentId(paymentIntentId: string): Promise<EntitlementRecord | null> {
    const rows = await this.database.$queryRaw<EntitlementRow[]>(Prisma.sql`
      SELECT id, account_id, entitlement_key, state, effective_at, expires_at, provider_reference, payment_intent_id
      FROM entitlements WHERE payment_intent_id = ${paymentIntentId} LIMIT 1
    `);
    return rows[0] ? this.toRecord(rows[0]) : null;
  }

  async findByPaymentIntent(accountId: string, entitlementKey: string, paymentIntentId: string): Promise<EntitlementRecord | null> {
    const rows = await this.database.$queryRaw<EntitlementRow[]>(Prisma.sql`
      SELECT id, account_id, entitlement_key, state, effective_at, expires_at, provider_reference, payment_intent_id
      FROM entitlements
      WHERE account_id = ${accountId}::uuid AND entitlement_key = ${entitlementKey} AND payment_intent_id = ${paymentIntentId}
      LIMIT 1
    `);
    return rows[0] ? this.toRecord(rows[0]) : null;
  }

  async transition(id: string, from: EntitlementState, to: EntitlementState): Promise<EntitlementRecord> {
    const rows = await this.database.$queryRaw<EntitlementRow[]>(Prisma.sql`
      UPDATE entitlements SET state = ${to}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}::uuid AND state = ${from}
      RETURNING id, account_id, entitlement_key, state, effective_at, expires_at, provider_reference, payment_intent_id
    `);
    if (!rows[0]) throw new NotFoundException('entitlement not found or state changed');
    return this.toRecord(rows[0]);
  }

  private toRecord(row: EntitlementRow | undefined): EntitlementRecord {
    if (!row) throw new NotFoundException('entitlement not found');
    return {
      id: row.id,
      accountId: row.account_id,
      entitlementKey: row.entitlement_key,
      state: row.state as EntitlementState,
      effectiveAt: row.effective_at,
      expiresAt: row.expires_at,
      providerReference: row.provider_reference,
      paymentIntentId: row.payment_intent_id,
    };
  }
}
