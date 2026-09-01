export const API_BASE_URL = (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL ?? 'http://localhost:3000';

export type Message = { id:string; conversationId:string; senderAccountId:string; body:string; createdAt:string };
export type Conversation = { id:string; createdAt:string; participants:Array<{accountId:string; joinedAt:string}> };

export type Account = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export class ApiError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const credential = sessionStorage.getItem('connect.credential');
  const headers = new Headers(init.headers);
  if (!headers.has('content-type') && init.body) headers.set('content-type', 'application/json');
  if (credential) headers.set('authorization', 'Bearer ' + credential);
  const response = await fetch(API_BASE_URL + path, { ...init, headers });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) sessionStorage.removeItem('connect.credential');
    throw new ApiError('Request failed', response.status);
  }
  return response.json() as Promise<T>;
}

export function register(email: string, password: string) {
  return apiRequest<void>('/auth/register', { method:'POST', body:JSON.stringify({email,password}) });
}

export function signIn(email: string, password: string) {
  return apiRequest<{credential?: string}>('/auth/sign-in', { method:'POST', body:JSON.stringify({email,password}) });
}

export function verifyEmail(token: string) {
  return apiRequest<{verified:boolean}>('/auth/email-verification', { method:'POST', body:JSON.stringify({token}) });
}

export function getAuthenticatedAccount() {
  return apiRequest<Account>('/accounts/authenticated');
}

export function createConversation(participantAccountIds: string[]) { return apiRequest<Conversation>('/conversations',{method:'POST',body:JSON.stringify({participantAccountIds})}); }
export function listMessages(conversationId:string) { return apiRequest<{messages:Message[]}>(\`/conversations/\${conversationId}/messages\`); }
export function sendMessage(conversationId:string, body:string) { return apiRequest<Message>(\`/conversations/\${conversationId}/messages\`,{method:'POST',body:JSON.stringify({body})}); }

export type RealtimeEvent = { eventId:string; eventType:string; schemaVersion:number; occurredAt:string; resource:{type:string;id:string}; payload:{conversationId?:string;messageId?:string;senderAccountId?:string} };
export function realtimeEventsUrl() { const credential=sessionStorage.getItem('connect.credential'); if(!credential) return null; return API_BASE_URL + '/realtime/events'; }
export function realtimeCredential() { return sessionStorage.getItem('connect.credential'); }

export type ProfileFieldRule = { kind:'string'|'number'|'boolean'; required?:boolean; minLength?:number; maxLength?:number; minimum?:number; maximum?:number };
export type ProfileCategory = { id:string; displayName?:string; key?:string; fieldSchema?:Record<string,ProfileFieldRule> };
export type DiscoveryProfile = { accountId:string; fields:Record<string, unknown>; categoryId:string };
export function listProfileCategories(){return apiRequest<{categories:ProfileCategory[]}>('/profile-categories');}
export function createMyProfile(input:{categoryId:string;fields:Record<string,string|number|boolean|null>;geographicScope?:{kind:string;countryCode?:string;regionCode?:string}}){return apiRequest('/profiles/me',{method:'POST',body:JSON.stringify(input)});}
export function discoverProfiles(params:{categoryId:string;scope?:string;countryCode?:string;limit?:number}){const q=new URLSearchParams({categoryId:params.categoryId,scope:params.scope??'global',limit:String(params.limit??20)});if(params.countryCode)q.set('countryCode',params.countryCode);return apiRequest<{items:DiscoveryProfile[];nextCursor?:string}>('/discovery?'+q);}
export function decideMatch(input:{targetAccountId:string;decision:'like'|'pass';idempotencyKey:string}){return apiRequest('/matches/decision',{method:'POST',body:JSON.stringify(input)});}

export function createConversationFromMutualMatch(targetAccountId:string){return apiRequest<Conversation>('/conversations/from-mutual-match',{method:'POST',body:JSON.stringify({targetAccountId})});}

export type Notification = { id:string; kind:string; payload:unknown; createdAt:string; readAt:string|null };
export function listNotifications(){return apiRequest<{notifications:Notification[]}>('/conversations/notifications');}
export function markNotificationRead(notificationId:string){return apiRequest<{updated?:boolean}>('/conversations/notifications/'+encodeURIComponent(notificationId)+'/read',{method:'POST'});}

export type MyProfile = { id:string; accountId:string; categoryId:string; fields:Record<string,string|number|boolean|null>; geographicScope:{kind:string;countryCode?:string;regionCode?:string} };
export function getMyProfile(){return apiRequest<MyProfile|null>('/profiles/me');}
export function updateMyProfile(input:{categoryId?:string;fields?:Record<string,string|number|boolean|null>;geographicScope?:{kind:string;countryCode?:string;regionCode?:string}}){return apiRequest<MyProfile>('/profiles/me',{method:'PATCH',body:JSON.stringify(input)});}
