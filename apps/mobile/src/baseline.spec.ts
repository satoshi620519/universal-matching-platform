import { describe, expect, it, vi } from 'vitest';
import { MobileSession } from './session';
import { MobileAuthService } from './auth-service';
import { MobileApiClient, MobileApiError } from './api-client';

describe('mobile session boundary', () => {
  it('clears secure session credentials after unauthorized responses', async () => {
    const store={get:vi.fn().mockResolvedValue('secret'),set:vi.fn(),clear:vi.fn().mockResolvedValue(undefined)};
    const client=new MobileApiClient({baseUrl:'https://api.example.test'},new MobileSession(store),vi.fn().mockResolvedValue({ok:false,status:401}) as any);
    await expect(client.request('/accounts/authenticated')).rejects.toBeInstanceOf(MobileApiError);
    expect(store.clear).toHaveBeenCalledOnce();
  });
});


describe('native navigation baseline', () => {
  it('uses platform tabs and keeps authentication outside primary destinations', () => {
    const source = readFileSync(resolve(__dirname, '../app/_layout.tsx'), 'utf8');
    expect(source).toContain("from 'expo-router'");
    expect(source).toContain('<Tabs');
    expect(source).toContain('tabBarHideOnKeyboard');
    expect(source).toContain('options={{ href: null }}');
  });
});


describe('mobile authentication service',()=>{it('restores an authenticated account from the secure credential boundary',async()=>{const store={get:async()=> 'token',set:async()=>{},clear:async()=>{}};const session=new MobileSession(store);const client=new MobileApiClient({baseUrl:'https://api.test'},session,async()=>({ok:true,json:async()=>({id:'a',status:'active',createdAt:'x',updatedAt:'x'})}) as any);const service=new MobileAuthService(client,session);expect((await service.restore()).kind).toBe('authenticated');});});


describe('mobile profile boundary',()=>{it('uses the authoritative profile endpoints without duplicating profile rules',()=>{const source=readFileSync(resolve(__dirname,'profile-service.ts'),'utf8');expect(source).toContain("'/profiles/me'");expect(source).toContain("method:'PATCH'");});});
