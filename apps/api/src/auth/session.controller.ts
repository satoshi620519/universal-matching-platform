import { Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { RequestPrincipalResolver } from './request-principal-resolver.js';
import { SessionRevocationService } from './session-revocation.service.js';

@Controller('auth')
export class SessionController {
  constructor(
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly revocation: SessionRevocationService,
  ) {}

  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ): Promise<void> {
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: requestId ?? 'auth-sign-out',
    });

    if (principal.sessionId) {
      await this.revocation.revoke(principal.sessionId);
    }
  }
}
