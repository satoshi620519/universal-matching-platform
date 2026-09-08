import { MobileSession } from './session';
export class MobileApiError extends Error { constructor(message:string, readonly status:number){super(message);} }
export type ApiRuntimeConfig={baseUrl:string};
export class MobileApiClient {
  constructor(private readonly config:ApiRuntimeConfig, private readonly session:MobileSession, private readonly fetcher:typeof fetch=fetch){}
  async request<T>(path:string, init:RequestInit={}):Promise<T>{
    const credential=await this.session.getCredential(); const headers=new Headers(init.headers);
    if(!headers.has('content-type')&&init.body)headers.set('content-type','application/json');
    if(credential)headers.set('authorization','Bearer '+credential);
    const response=await this.fetcher(this.config.baseUrl+path,{...init,headers});
    if(!response.ok){if(response.status===401||response.status===403)await this.session.clear();throw new MobileApiError('Request failed',response.status);}
    return response.json() as Promise<T>;
  }
}
