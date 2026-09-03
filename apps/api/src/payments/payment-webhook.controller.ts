import { BadRequestException, Body, Controller, Headers, Post, Req, type RawBodyRequest } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
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
    @Req() request?: RawBodyRequest<FastifyRequest>,
  ): Promise<{ readonly accepted: boolean; readonly processed: boolean }> {
    const providerSignature = stripeSignature ?? signature;
    if (!providerSignature) throw new BadRequestException('missing payment signature');

    const rawBody = request?.rawBody?.toString('utf8');
    const verified = await this.transport.verifyAndParse({ signature: providerSignature, rawBody, payload });
    const processed = await this.processor.process(verified.event, verified.context);
    return { accepted: true, processed };
  }
}
