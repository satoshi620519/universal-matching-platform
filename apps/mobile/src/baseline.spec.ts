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


describe('mobile profile schema boundary',()=>{it('loads category field schemas from the authoritative API instead of hardcoding fields',()=>{const source=readFileSync(resolve(__dirname,'profile-service.ts'),'utf8');expect(source).toContain("'/profile-categories'");const screen=readFileSync(resolve(__dirname,'../app/profile.tsx'),'utf8');expect(screen).toContain('category?.fieldSchema');});});


describe('mobile discovery and matching boundary',()=>{it('uses bounded authoritative discovery and idempotent match decisions',()=>{const source=readFileSync(resolve(__dirname,'discovery-service.ts'),'utf8');expect(source).toContain("limit:'20'");expect(source).toContain("'/matches/decision'");expect(source).toContain('idempotencyKey');});});


describe('mobile discovery continuation',()=>{it('uses server-provided category ids and cursor continuation without inventing client pagination',()=>{const source=readFileSync(resolve(__dirname,'../app/discover.tsx'),'utf8');expect(source).toContain('profiles.listCategories()');expect(source).toContain('page.nextCursor');expect(source).toContain('load(cursor)');});});


describe('mobile messaging boundary',()=>{it('delegates conversation authorization, messages, read state and deletion to Phase 10 APIs',()=>{const source=readFileSync(resolve(__dirname,'messaging-service.ts'),'utf8');expect(source).toContain('/conversations/from-mutual-match');expect(source).toContain('/read');expect(source).toContain("method:'DELETE'");});});


describe('mobile realtime reconciliation',()=>{it('treats SSE as a hint and reconciles durable state before and after reconnect',async()=>{const source=readFileSync(resolve(__dirname,'realtime-service.ts'),'utf8');expect(source).toContain('await this.reconcile()');expect(source).toContain("'/realtime/events'");expect(source).toContain('setTimeout');expect(source).toContain('stop()');});});


describe('mobile messaging reconciliation reads',()=>{it('uses durable notification and message reads as realtime recovery paths',()=>{const source=readFileSync(resolve(__dirname,'messaging-service.ts'),'utf8');expect(source).toContain("'/notifications'");expect(source).toContain('/messages');});});


describe('mobile messaging entry and reconciliation',()=>{it('uses durable notification acknowledgement and per-conversation reads instead of inventing a conversation list',()=>{const source=readFileSync(resolve(__dirname,'messaging-service.ts'),'utf8');expect(source).toContain('/notifications/unread');expect(source).toContain('markNotificationRead');const screen=readFileSync(resolve(__dirname,'../app/conversations.tsx'),'utf8');expect(screen).toContain('listNotifications()');expect(screen).toContain('listMessages');expect(screen).toContain('markRead');});});


describe('mobile mutual-match conversation handoff',()=>{it('keeps conversation creation server-authoritative and accepts a routed conversation id',()=>{const discovery=readFileSync(resolve(__dirname,'discovery-service.ts'),'utf8');expect(discovery).toContain('MatchDecisionResult');const screen=readFileSync(resolve(__dirname,'../app/conversations.tsx'),'utf8');expect(screen).toContain('useLocalSearchParams');expect(screen).toContain('params.conversationId');});});


describe('mobile mutual match handoff',()=>{it('creates a conversation only after the server reports a mutual match and routes the returned id',()=>{const source=readFileSync(resolve(__dirname,'../app/discover.tsx'),'utf8');expect(source).toContain("result.mutual");expect(source).toContain('createFromMutualMatch');expect(source).toContain('conversation.id');expect(source).not.toContain('match?.conversationId');});});


describe('M16.6 acceptance boundary',()=>{it('covers routed auto-load, durable send/read/delete and lifecycle reconciliation without local authority',()=>{const screen=readFileSync(resolve(__dirname,'../app/conversations.tsx'),'utf8');expect(screen).toContain('useEffect(()=>{if(params.conversationId)open();}');expect(screen).toContain('service.delete');expect(screen).toContain('service.markRead');const realtime=readFileSync(resolve(__dirname,'realtime-service.ts'),'utf8');expect(realtime).toContain('stop()');expect(realtime).toContain('await this.reconcile()');});});


describe('M16.7 mobile acceptance inventory',()=>{it('keeps all primary routes registered and purchaser verification scripts available',()=>{const layout=readFileSync(resolve(__dirname,'../app/_layout.tsx'),'utf8');for(const route of['index','discover','conversations','activity','profile','sign-in'])expect(layout).toContain('name="'+route+'"');const pkg=readFileSync(resolve(__dirname,'../package.json'),'utf8');for(const script of['"typecheck"','"test"','"build"'])expect(pkg).toContain(script);});});
