export interface AdministrativeConversation {
  readonly id: string;
  readonly createdAt: string;
  readonly participantCount: number;
  readonly messageCount: number;
  readonly lastMessageAt: string | null;
}
export interface AdministrativeConversationPage { readonly items: readonly AdministrativeConversation[]; readonly nextCursor: string | null; }
export interface AdministrativeConversationsApi { list(input?: { cursor?: string; limit?: number }): Promise<AdministrativeConversationPage>; }

export function createBrowserAdministrativeConversationsApi(): AdministrativeConversationsApi {
  return {
    async list(input = {}) {
      const baseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';
      const query = new URLSearchParams();
      if (input.cursor) query.set('cursor', input.cursor);
      if (input.limit) query.set('limit', String(input.limit));
      const response = await fetch(`${baseUrl}/administration/conversations${query.size ? `?${query}` : ''}`, {
        headers: { Accept: 'application/json', ...(import.meta.env.VITE_ADMIN_AUTHORIZATION ? { authorization: import.meta.env.VITE_ADMIN_AUTHORIZATION as string } : {}) }, credentials: 'include',
      });
      if (!response.ok) throw new Error(`Unable to load conversations (${response.status}).`);
      return response.json();
    },
  };
}
