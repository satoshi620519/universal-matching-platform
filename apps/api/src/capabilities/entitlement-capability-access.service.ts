import { Injectable } from '@nestjs/common';
import type { RequestPrincipal } from '../auth/request-principal.js';
import { AuthenticatedAccountContextService } from '../accounts/authenticated-account-context.service.js';
import { EntitlementService } from '../entitlements/entitlement.service.js';
import { CapabilityAccessService, type CapabilityAccessResult } from './capability-access.service.js';

/**
 * Protected-capability boundary backed by persisted entitlement state.
 * Client input can name the required entitlement, but cannot assert its state.
 */
@Injectable()
export class EntitlementCapabilityAccessService {
  constructor(
    private readonly accounts: AuthenticatedAccountContextService,
    private readonly entitlements: EntitlementService,
    private readonly capabilities: CapabilityAccessService,
  ) {}

  async evaluate(
    principal: RequestPrincipal,
    input: { readonly entitlementKey: string; readonly now?: string },
  ): Promise<CapabilityAccessResult> {
    const { account } = await this.accounts.resolve(principal);
    const now = new Date(input.now ?? new Date().toISOString());
    const entitlement = await this.entitlements.findUsable(
      account.id,
      input.entitlementKey,
      now,
    );

    return this.capabilities.evaluate({
      currentVerificationLevel: 0,
      entitlementState: entitlement?.state ?? 'revoked',
      entitlementEffectiveAt: entitlement?.effectiveAt.toISOString(),
      now: now.toISOString(),
    });
  }
}
