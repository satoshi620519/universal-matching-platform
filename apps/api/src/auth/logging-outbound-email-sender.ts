import { Injectable } from '@nestjs/common';

import { OutboundEmailSender, type OutboundEmail } from './outbound-email-sender.js';

@Injectable()
export class LoggingOutboundEmailSender extends OutboundEmailSender {
  async send(_message: OutboundEmail): Promise<void> {
    // Delivery infrastructure is environment-specific. This adapter deliberately
    // performs no fake external delivery and can be replaced by a provider.
  }
}
