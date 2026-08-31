import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { EmailVerificationService } from './email-verification.service.js';

interface VerifyEmailBody {
  readonly token?: unknown;
}

@Controller('auth/email-verification')
export class EmailVerificationController {
  constructor(private readonly verification: EmailVerificationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async verify(
    @Body() body: VerifyEmailBody,
  ): Promise<{ readonly verified: boolean }> {
    const result = await this.verification.verify(
      typeof body?.token === 'string' ? body.token : '',
    );

    return { verified: result.kind === 'verified' };
  }
}
