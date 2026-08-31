import { describe, expect, it } from 'vitest';
import {
  getRequestPrincipal,
  setRequestPrincipal,
} from './authenticated-request.js';

describe('authenticated request principal source', () => {
  it('stores and retrieves one request principal', () => {
    const request = {} as never;
    const principal = {
      accountId: '00000000-0000-0000-0000-000000000001',
      authenticationMethod: 'test',
      verificationLevel: '2',
    };

    setRequestPrincipal(request, principal);

    expect(getRequestPrincipal(request)).toEqual(principal);
  });
});
