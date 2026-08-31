import { describe, expect, it } from 'vitest';

import { classifyEmailDeliveryFailure } from './email-delivery-failure.js';

describe('classifyEmailDeliveryFailure', () => {
  it('classifies provider 5xx errors as transient', () => {
    const error = Object.assign(new Error('provider unavailable'), { status: 503 });
    expect(classifyEmailDeliveryFailure(error)).toEqual({
      kind: 'transient',
      message: 'provider unavailable',
    });
  });

  it('classifies ordinary provider 4xx errors as permanent', () => {
    const error = Object.assign(new Error('recipient rejected'), { status: 422 });
    expect(classifyEmailDeliveryFailure(error).kind).toBe('permanent');
  });

  it('treats rate limiting as transient', () => {
    const error = Object.assign(new Error('slow down'), { status: 429 });
    expect(classifyEmailDeliveryFailure(error).kind).toBe('transient');
  });
});
