import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { PasswordSignInTransportService } from './password-sign-in-transport.service.js';
import { deriveRegistrationRateLimitKey } from './registration-rate-limit-key.js';
import { serializeAdminSessionCookie } from './session-cookie.js';

interface PasswordSignInBody {
  readonly email?: unknown;
  readonly password?: unknown;
}

@Controller('auth')
export class PasswordSignInController {
  constructor(private readonly signIn: PasswordSignInTransportService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signInRequest(
    @Body() body: PasswordSignInBody,
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<{ authenticated: boolean }> {
    const result = await this.signIn.signInRequest({
      email: typeof body?.email === 'string' ? body.email : '',
      password: typeof body?.password === 'string' ? body.password : '',
      rateLimitKey: deriveRegistrationRateLimitKey(request.ip),
    });

    if (result.kind === 'rejected') {
      return { authenticated: false };
    }

    reply.header('set-cookie', serializeAdminSessionCookie(result.credential));
    return { authenticated: true };
  }
}
