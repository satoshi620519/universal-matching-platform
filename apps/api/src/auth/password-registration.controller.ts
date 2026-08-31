import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

import { PasswordRegistrationTransportService } from './password-registration-transport.service.js';
import { deriveRegistrationRateLimitKey } from './registration-rate-limit-key.js';

interface RegistrationBody {
  readonly email?: unknown;
  readonly password?: unknown;
}

@Controller('auth')
export class PasswordRegistrationController {
  constructor(
    private readonly registration: PasswordRegistrationTransportService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.ACCEPTED)
  async register(
    @Body() body: RegistrationBody,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    const email = typeof body?.email === 'string' ? body.email : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    await this.registration.register({
      email,
      password,
      rateLimitKey: deriveRegistrationRateLimitKey(request.ip),
    });
  }
}
