import { describe, expect, it } from 'vitest';
import { AnonymousAuthenticationAdapter } from './anonymous-authentication.adapter.js';

describe('anonymous authentication adapter', () => {
  it('does not authenticate requests before a concrete provider is selected', async () => {
    const principal = await new AnonymousAuthenticationAdapter().authenticate({
      authorization: 'Bearer ignored',
      requestId: 'corr-123',
    });

    expect(principal).toBeUndefined();
  });
});
