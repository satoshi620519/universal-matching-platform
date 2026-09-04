import { describe, expect, it } from 'vitest';
import { PasswordResetCompletionService } from './password-reset-completion.service.js';

const now=new Date('2026-09-04T00:00:00Z');
const recovery={id:'r1',authenticationIdentityId:'i1',secretHash:'hash',status:'active' as const,requestedAt:now,expiresAt:new Date('2026-09-04T01:00:00Z'),consumedAt:null,revokedAt:null};

describe('PasswordResetCompletionService',()=>{
  it('replaces credential, consumes recovery, and revokes all sessions in order',async()=>{
    const events:string[]=[];
    const service=new PasswordResetCompletionService(
      {findById:async()=>recovery,consume:async()=>{events.push('consume');}},
      {findById:async()=>({id:'i1',accountId:'a1'})},
      {replacePasswordHash:async()=>{events.push('replace');return {} as never;}} as never,
      {hash:async()=>{events.push('hash');return 'new-hash';}},
      {revokeAllForAccount:async()=>{events.push('revoke-all');}},
    );
    expect(await service.complete({recoveryId:'r1',newPassword:'new-secret',now})).toEqual({ok:true});
    expect(events).toEqual(['hash','replace','consume','revoke-all']);
  });

  it('does nothing for unusable recovery',async()=>{
    let sideEffects=0;
    const service=new PasswordResetCompletionService(
      {findById:async()=>({...recovery,status:'consumed' as const,consumedAt:now}),consume:async()=>{sideEffects++;}},
      {} as never,{} as never,{hash:async()=>{sideEffects++;return 'x';}},{revokeAllForAccount:async()=>{sideEffects++;}},
    );
    expect((await service.complete({recoveryId:'r1',newPassword:'x',now})).ok).toBe(false);
    expect(sideEffects).toBe(0);
  });
});