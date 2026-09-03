import { BadRequestException, Body, Controller, Headers, Post } from '@nestjs/common';

export interface PaymentWebhookTransport {
  verifyAndParse(input: { readonly signature?: string; readonly payload: unknown }): Promise<unknown>;
}

/** Transport boundary. Provider-specific signature verification is injected, never performed from untrusted fields. */
@Controller('payments/webhook')
export class PaymentWebhookController {
  constructor(private readonly transport: PaymentWebhookTransport) {}

  @Post()
  async receive(
    @Body() payload: unknown,
    @Headers('payment-signature') signature?: string,
  ): Promise<{ readonly accepted: boolean }> {
    if (!signature) throw new BadRequestException('missing payment signature');
    await this.transport.verifyAndParse({ signature, payload });
    return { accepted: true };
  }
}
