import { MobileApiClient } from './api-client';
import { MobileSession } from './session';

export type AuthenticatedAccount={id:string;status:string;createdAt:string;updatedAt:string};
export type AuthState={kind:'restoring'|'authenticated'|'anonymous'|'error';account?:AuthenticatedAccount;message?:string};

export class MobileAuthService {
  constructor(private readonly api:MobileApiClient, private readonly session:MobileSession){}
  async signIn(email:string,password:string){
    const result=await this.api.request<{credential?:string}>('/auth/sign-in',{method:'POST',body:JSON.stringify({email,password})});
    if(!result.credential) throw new Error('Sign in was not accepted');
    await this.session.setCredential(result.credential);
    return this.restore();
  }
  async restore():Promise<AuthState>{
    if(!await this.session.getCredential()) return {kind:'anonymous'};
    try{return {kind:'authenticated',account:await this.api.request<AuthenticatedAccount>('/accounts/authenticated')};}
    catch(error){return {kind:'anonymous'};}
  }
  async signOut(){await this.session.clear();}
}
