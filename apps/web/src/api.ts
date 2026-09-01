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
