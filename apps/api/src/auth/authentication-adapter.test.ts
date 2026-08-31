import { describe, expect, it } from 'vitest';
import { RequestAuthenticationAdapter } from './authentication-adapter.js';

describe('authentication adapter boundary', () => {
  it('allows adapters to remain independent from a concrete provider', async () => {
    class TestAdapter extends RequestAuthenticationAdapter {
      async authenticate() {
        return {
          accountId: '00000000-0000-0000-0000-000000000001',
          authenticationMethod: 'test',
        };
      }
    }

    const principal = await new TestAdapter().authenticate({
      requestId: 'corr-123',
    });

    expect(principal?.accountId).toBeDefined();
  });
});
