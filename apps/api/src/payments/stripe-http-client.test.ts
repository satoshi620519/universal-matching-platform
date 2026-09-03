import { describe, expect, it, vi, afterEach } from 'vitest';
import { FetchStripeHttpClient, StripeHttpError } from './stripe-http-client.js';

describe('FetchStripeHttpClient', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('sends form requests through the Stripe infrastructure boundary', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ id: 'pi_1' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const client = new FetchStripeHttpClient('sk_test');
    await expect(client.request({ method: 'POST', path: '/v1/payment_intents', form: { amount: '100' } })).resolves.toEqual({ id: 'pi_1' });
    expect(fetchMock).toHaveBeenCalledWith('https://api.stripe.com/v1/payment_intents', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer sk_test' }),
    }));
  });

  it('fails closed on non-success provider responses', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('provider error', { status: 500 })));
    await expect(new FetchStripeHttpClient('sk').request({ method: 'GET', path: '/v1/x' }))
      .rejects.toBeInstanceOf(StripeHttpError);
  });

  it('rejects malformed successful provider responses', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('not-json', { status: 200 })));
    await expect(new FetchStripeHttpClient('sk').request({ method: 'GET', path: '/v1/x' }))
      .rejects.toThrow('invalid JSON response from Stripe API');
  });
});
