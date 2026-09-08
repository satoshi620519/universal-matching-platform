import { MobileApiClient } from './api-client';
export type MobileConversation={id:string;participants?:{accountId:string}[]};
export type MobileMessage={id:string;conversationId:string;senderAccountId:string;body:string;createdAt?:string;deletedAt?:string|null};
export type MobileNotification={id:string;kind:string;payload:Record<string,unknown>;createdAt?:string;readAt?:string|null};
export class MobileMessagingService{
 constructor(private readonly api:MobileApiClient){}
 listMessages(conversationId:string){return this.api.request<{messages:MobileMessage[]}>(`/conversations/${conversationId}/messages`);}
 listNotifications(){return this.api.request<{notifications:MobileNotification[]}>('/notifications');}
 listUnreadNotifications(){return this.api.request<{notifications:MobileNotification[]}>('/notifications/unread');}
 markNotificationRead(notificationId:string){return this.api.request<{updated:boolean}>('/notifications/'+notificationId+'/read',{method:'POST'});}
 createFromMutualMatch(targetAccountId:string){return this.api.request<MobileConversation>('/conversations/from-mutual-match',{method:'POST',body:JSON.stringify({targetAccountId})});}
 send(conversationId:string,body:string){return this.api.request<MobileMessage>(`/conversations/${conversationId}/messages`,{method:'POST',body:JSON.stringify({body})});}
 markRead(conversationId:string){return this.api.request<{updated:boolean}>(`/conversations/${conversationId}/read`,{method:'POST'});}
 delete(conversationId:string,messageId:string){return this.api.request<{deleted:boolean}>(`/conversations/${conversationId}/messages/${messageId}`,{method:'DELETE'});}
}
