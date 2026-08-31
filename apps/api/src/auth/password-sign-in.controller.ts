import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

import { PasswordSignInTransportService } from './password-sign-in-transport.service.js';
import { deriveRegistrationRateLimitKey } from './registration-rate-limit-key.js';

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
  ): Promise<{ credential?: string }> {
    const result = await this.signIn.signInRequest({
      email: typeof body?.email === 'string' ? body.email : '',
      password: typeof body?.password === 'string' ? body.password : '',
      rateLimitKey: deriveRegistrationRateLimitKey(request.ip),
    });

    return result.kind === 'accepted' ? { credential: result.credential } : {};
  }
}
