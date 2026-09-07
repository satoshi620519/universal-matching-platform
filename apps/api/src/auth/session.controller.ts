import { Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { RequestPrincipalResolver } from './request-principal-resolver.js';
import { SessionRevocationService } from './session-revocation.service.js';
import { readAdminSessionCookie, serializeClearedAdminSessionCookie } from './session-cookie.js';
import { Req, Res } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Controller('auth')
export class SessionController {
  constructor(
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly revocation: SessionRevocationService,
  ) {}

  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-request-id') requestId: string | undefined,
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<void> {
    const cookieCredential = readAdminSessionCookie(request.headers.cookie);
    const principal = await this.principalResolver.requireAuthenticated({
      authorization: authorization ?? (cookieCredential ? `Bearer ${cookieCredential}` : undefined),
      requestId: requestId ?? 'auth-sign-out',
    });

    if (principal.sessionId) {
      await this.revocation.revoke(principal.sessionId);
    }

    reply.header('set-cookie', serializeClearedAdminSessionCookie());
  }
}
