import { Injectable } from '@nestjs/common';

import { EmailVerificationUrlPolicy } from './email-verification-url-policy.js';

@Injectable()
export class EnvironmentEmailVerificationUrlPolicy extends EmailVerificationUrlPolicy {
  baseUrl(): string {
    return process.env.EMAIL_VERIFICATION_BASE_URL ?? 'http://localhost:3000';
  }
}
