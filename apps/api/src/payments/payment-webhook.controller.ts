import { BadRequestException, Body, Controller, Headers, Post } from '@nestjs/common';
import type { PaymentWebhookProcessor } from './payment-webhook-processor.js';
import type { VerifiedPaymentWebhookTransport } from './payment-webhook-transport.js';

/** HTTP boundary: only cryptographically verified webhook data reaches the processor. */
@Controller('payments/webhook')
export class PaymentWebhookController {
  constructor(
    private readonly transport: VerifiedPaymentWebhookTransport,
    private readonly processor: PaymentWebhookProcessor,
  ) {}

  @Post()
  async receive(
    @Body() payload: unknown,
    @Headers('payment-signature') signature?: string,
    @Headers('stripe-signature') stripeSignature?: string,
    @Headers('x-raw-body') rawBody?: string,
  ): Promise<{ readonly accepted: boolean; readonly processed: boolean }> {
    const providerSignature = stripeSignature ?? signature;
    if (!providerSignature) throw new BadRequestException('missing payment signature');
    const verified = await this.transport.verifyAndParse({ signature: providerSignature, rawBody, payload });
    const processed = await this.processor.process(verified.event, verified.context);
    return { accepted: true, processed };
  }
}
