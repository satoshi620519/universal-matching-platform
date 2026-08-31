import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CurrentPrincipal } from './current-principal.decorator.js';
import { SessionRevocationService } from './session-revocation.service.js';
import type { RequestPrincipal } from './request-principal.js';

@Controller('auth')
export class SessionController {
  constructor(private readonly revocation: SessionRevocationService) {}

  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(@CurrentPrincipal() principal: RequestPrincipal): Promise<void> {
    if (principal.sessionId) {
      await this.revocation.revoke(principal.sessionId);
    }
  }
}
