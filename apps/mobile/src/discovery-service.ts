import { MobileApiClient } from './api-client';
export type DiscoveryItem={accountId:string;fields:Record<string,unknown>;biography?:string;compatibilityScore?:number};
export type DiscoveryPage={items:DiscoveryItem[];nextCursor?:string};
export type MatchDecision='like'|'pass';
export class MobileDiscoveryService{
 constructor(private readonly api:MobileApiClient){}
 discover(categoryId:string,cursor?:string){const q=new URLSearchParams({categoryId,scope:'global',limit:'20'});if(cursor)q.set('cursor',cursor);return this.api.request<DiscoveryPage>('/discovery?'+q.toString());}
 decide(targetAccountId:string,decision:MatchDecision,idempotencyKey:string){return this.api.request<{state:string;match?:unknown}>('/matches/decision',{method:'POST',body:JSON.stringify({targetAccountId,decision,idempotencyKey})});}
}
