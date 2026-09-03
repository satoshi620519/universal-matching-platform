import { Injectable } from '@nestjs/common';
import type { StripeHttpClient } from './stripe-payment-provider.js';

export class StripeHttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
  ) {
    super(`Stripe API request failed with status ${status}`);
  }
}

/** Fetch-based infrastructure boundary; payment domain never depends on a Stripe SDK. */
@Injectable()
export class FetchStripeHttpClient implements StripeHttpClient {
  constructor(private readonly secretKey: string) {}

  async request(input: {
    readonly method: 'GET' | 'POST';
    readonly path: string;
    readonly form?: Record<string, string>;
  }): Promise<unknown> {
    const response = await fetch(`https://api.stripe.com${input.path}`, {
      method: input.method,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        ...(input.method === 'POST' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
      },
      ...(input.form ? { body: new URLSearchParams(input.form).toString() } : {}),
    });

    const body = await response.text();
    if (!response.ok) throw new StripeHttpError(response.status, body);

    try {
      return JSON.parse(body) as unknown;
    } catch {
      throw new Error('invalid JSON response from Stripe API');
    }
  }
}
