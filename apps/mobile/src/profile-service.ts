import { MobileApiClient } from './api-client';
export type MobileProfileFieldValue=string|number|boolean|null;
export type MobileProfile={id:string;categoryId:string;fields:Record<string,MobileProfileFieldValue>;biography?:string|null;geographicScope?:unknown;avatar?:unknown;gallery?:unknown};
export type MobileCategory={id:string;key:string;fieldSchema:Record<string,{kind:string;required?:boolean;minLength?:number;maxLength?:number;visibility?:string}>};
export class MobileProfileService{
 constructor(private readonly api:MobileApiClient){}
 getMine(){return this.api.request<MobileProfile>('/profiles/me');}
 listCategories(){return this.api.request<{categories:MobileCategory[]}>('/profile-categories');}
 updateMine(input:Partial<Pick<MobileProfile,'fields'|'biography'|'geographicScope'|'avatar'|'gallery'>>){return this.api.request<MobileProfile>('/profiles/me',{method:'PATCH',body:JSON.stringify(input)});}
}
