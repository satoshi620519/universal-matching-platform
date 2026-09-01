import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { DuplicateAuthenticationIdentityError } from './duplicate-authentication-identity.error.js';
import { normalizeEmailProviderSubject } from './email-provider-subject.js';
import { PasswordPolicy } from './password-policy.js';
import {
  PasswordRegistrationService,
  type RegisterPasswordAccountInput,
} from './password-registration.service.js';
import { RequestRateLimiter } from '../common/rate-limit/request-rate-limiter.js';

export interface RegisterPasswordTransportInput {
  readonly email: string;
  readonly password: string;
  readonly rateLimitKey: string;
}

@Injectable()
export class PasswordRegistrationTransportService {
  constructor(
    private readonly limiter: RequestRateLimiter,
    private readonly passwordPolicy: PasswordPolicy,
    private readonly registration: PasswordRegistrationService,
  ) {}

  async register(input: RegisterPasswordTransportInput): Promise<void> {
    const decision = this.limiter.consume(input.rateLimitKey, {
      limit: 5,
      windowMs: 60_000,
    });

    if (!decision.allowed) {
      throw new HttpException('Registration temporarily unavailable', HttpStatus.TOO_MANY_REQUESTS);
    }

    const email = normalizeEmailProviderSubject(input.email);
    if (!email) {
      throw new BadRequestException('Invalid registration input');
    }

    if (this.passwordPolicy.validate(input.password).length > 0) {
      throw new BadRequestException('Invalid registration input');
    }

    try {
      await this.registration.register({
        providerSubject: email,
        password: input.password,
      } satisfies RegisterPasswordAccountInput);
    } catch (error) {
      if (error instanceof DuplicateAuthenticationIdentityError) {
        // Keep duplicate identity responses indistinguishable from successful
        // submission to reduce account enumeration at this transport boundary.
        return;
      }
      throw error;
    }
  }
}
