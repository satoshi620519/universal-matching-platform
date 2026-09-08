import { describe, expect, it, vi } from 'vitest';
import { MobileSession } from './session';
import { MobileApiClient, MobileApiError } from './api-client';

describe('mobile session boundary', () => {
  it('clears secure session credentials after unauthorized responses', async () => {
    const store={get:vi.fn().mockResolvedValue('secret'),set:vi.fn(),clear:vi.fn().mockResolvedValue(undefined)};
    const client=new MobileApiClient({baseUrl:'https://api.example.test'},new MobileSession(store),vi.fn().mockResolvedValue({ok:false,status:401}) as any);
    await expect(client.request('/accounts/authenticated')).rejects.toBeInstanceOf(MobileApiError);
    expect(store.clear).toHaveBeenCalledOnce();
  });
});
