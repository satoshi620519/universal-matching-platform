import { describe, expect, it } from 'vitest';
import { createAuthenticatedRequestContext } from './authenticated-request-context.js';

describe('authenticated request context', () => {
  it('combines principal identity and correlation context', () => {
    const context = createAuthenticatedRequestContext(
      {
        accountId: '00000000-0000-0000-0000-000000000001',
        authenticationMethod: 'provider-neutral',
      },
      'corr-123',
    );

    expect(context.principal.accountId).toBe('00000000-0000-0000-0000-000000000001');
    expect(context.correlationId).toBe('corr-123');
  });

  it('rejects unauthenticated context creation', () => {
    expect(() => createAuthenticatedRequestContext(undefined, 'corr-123')).toThrow(
      'Authenticated request principal is required',
    );
  });
});
