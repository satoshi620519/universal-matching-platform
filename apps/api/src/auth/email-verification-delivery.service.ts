import { Injectable } from '@nestjs/common';

import { buildEmailVerificationLink } from './email-verification-link.js';
import { EmailVerificationService } from './email-verification.service.js';
import { OutboundEmailSender } from './outbound-email-sender.js';

@Injectable()
export class EmailVerificationDeliveryService {
  constructor(
    private readonly verification: EmailVerificationService,
    private readonly email: OutboundEmailSender,
  ) {}

  async issueAndDeliver(input: {
    readonly accountId: string;
    readonly emailAddress: string;
    readonly verificationBaseUrl: string;
  }): Promise<void> {
    const token = await this.verification.issue(input.accountId);
    const link = buildEmailVerificationLink(
      { baseUrl: input.verificationBaseUrl },
      token,
    );

    await this.email.send({
      to: input.emailAddress,
      subject: 'Verify your email address',
      text: 'Verify your email address by opening: ' + link,
    });
  }
}
