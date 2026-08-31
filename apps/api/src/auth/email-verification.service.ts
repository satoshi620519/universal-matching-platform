import { Injectable } from '@nestjs/common';

import { AccountRepository } from '../accounts/account.repository.js';
import { createEmailVerificationToken, hashEmailVerificationToken } from './email-verification-token.js';
import { EmailVerificationTokenRepository } from './email-verification-token.repository.js';

export type EmailVerificationResult =
  | { readonly kind: 'verified'; readonly accountId: string }
  | { readonly kind: 'rejected' };

@Injectable()
export class EmailVerificationService {
  private static readonly TOKEN_TTL_MS = 1000 * 60 * 30;

  constructor(
    private readonly accounts: AccountRepository,
    private readonly tokens: EmailVerificationTokenRepository,
  ) {}

  async issue(accountId: string): Promise<string> {
    const token = createEmailVerificationToken();
    await this.tokens.create({
      accountId,
      tokenHash: token.hash,
      expiresAt: new Date(Date.now() + EmailVerificationService.TOKEN_TTL_MS),
    });
    return token.raw;
  }

  async verify(rawToken: string): Promise<EmailVerificationResult> {
    if (!rawToken) {
      return { kind: 'rejected' };
    }

    const token = await this.tokens.consumeIfUsable(
      hashEmailVerificationToken(rawToken),
      new Date(),
    );

    if (!token) {
      return { kind: 'rejected' };
    }

    const account = await this.accounts.findById(token.accountId);
    if (!account || account.status !== 'pending') {
      return { kind: 'rejected' };
    }

    const updated = await this.accounts.updateStatus(account.id, 'active');
    return updated
      ? { kind: 'verified', accountId: updated.id }
      : { kind: 'rejected' };
  }
}
