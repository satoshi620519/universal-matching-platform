import { Injectable, TooManyRequestsException } from '@nestjs/common';

import { PasswordSignInService } from './password-sign-in.service.js';
import { SessionIssuanceService } from './session-issuance.service.js';
import { RequestRateLimiter } from '../common/rate-limit/request-rate-limiter.js';

export interface PasswordSignInTransportInput {
  readonly email: string;
  readonly password: string;
  readonly rateLimitKey: string;
}

export type PasswordSignInTransportResult =
  | { readonly kind: 'accepted'; readonly credential: string }
  | { readonly kind: 'rejected' };

@Injectable()
export class PasswordSignInTransportService {
  constructor(
    private readonly limiter: RequestRateLimiter,
    private readonly signIn: PasswordSignInService,
    private readonly sessions: SessionIssuanceService,
  ) {}

  async signInRequest(
    input: PasswordSignInTransportInput,
  ): Promise<PasswordSignInTransportResult> {
    const decision = this.limiter.consume(input.rateLimitKey, {
      limit: 10,
      windowMs: 60_000,
    });

    if (!decision.allowed) {
      throw new TooManyRequestsException('Sign-in temporarily unavailable');
    }

    const result = await this.signIn.signIn({
      email: input.email,
      password: input.password,
    });

    if (result.kind === 'rejected') {
      return result;
    }

    const issued = await this.sessions.issue({
      accountId: result.accountId,
      authenticationMethod: 'password',
    });

    return { kind: 'accepted', credential: issued.credential };
  }
}
