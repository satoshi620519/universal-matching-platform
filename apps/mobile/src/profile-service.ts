import { MobileApiClient } from './api-client';
export type MobileProfile={id:string;categoryId:string;fields:Record<string,string|number|boolean|null>;biography?:string|null;geographicScope?:unknown;avatar?:unknown;gallery?:unknown};
export class MobileProfileService{
 constructor(private readonly api:MobileApiClient){}
 getMine(){return this.api.request<MobileProfile>('/profiles/me');}
 updateMine(input:Partial<Pick<MobileProfile,'fields'|'biography'|'geographicScope'|'avatar'|'gallery'>>){return this.api.request<MobileProfile>('/profiles/me',{method:'PATCH',body:JSON.stringify(input)});}
}
