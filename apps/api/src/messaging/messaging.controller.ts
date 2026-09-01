import { Body, Controller, Get, Headers, HttpStatus, Param, Post } from '@nestjs/common';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { PrismaConversationRepository } from './prisma-conversation.repository.js';
import { PrismaMessageRepository } from './prisma-message.repository.js';
import { PrismaNotificationRepository } from './prisma-notification.repository.js';
import { MessageRealtimePublicationService } from './message-realtime-publication.service.js';
import { PrismaMatchTransitionRepository } from '../matching/prisma-match-transition.repository.js';

@Controller('conversations')
export class MessagingController {
  constructor(
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly conversations: PrismaConversationRepository,
    private readonly messages: PrismaMessageRepository,
    private readonly notifications: PrismaNotificationRepository,
    private readonly messageRealtime: MessageRealtimePublicationService,
    private readonly matches: PrismaMatchTransitionRepository,
  ) {}

  @Post()
  async createConversation(
    @Body() body: { participantAccountIds?: string[] },
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'conversation-create' });
    const participantAccountIds = [...(body.participantAccountIds ?? []), principal.accountId];
    return this.conversations.create(participantAccountIds);
  }

  @Post('from-mutual-match')
  async createConversationFromMutualMatch(
    @Body() body: { targetAccountId?: string },
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'conversation-mutual-match' });
    const targetAccountId = body.targetAccountId?.trim() ?? '';
    if (!targetAccountId || !(await this.matches.isMutualMatch(principal.accountId, targetAccountId))) {
      return { statusCode: HttpStatus.NOT_FOUND };
    }
    return this.conversations.createOrFindDirect(principal.accountId, targetAccountId);
  }

  @Get(':conversationId/messages')
  async listMessages(
    @Param('conversationId') conversationId: string,
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'message-list' });
    const messages = await this.messages.listForParticipant({ conversationId, accountId: principal.accountId });
    if (!messages) return { statusCode: HttpStatus.NOT_FOUND, messages: [] };
    return { messages };
  }

  @Post(':conversationId/messages')
  async createMessage(
    @Param('conversationId') conversationId: string,
    @Body() body: { body?: string },
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'message-create' });
    const created = await this.messages.createForParticipant({ conversationId, senderAccountId: principal.accountId, body: body.body ?? '' });
    if (!created) return { statusCode: HttpStatus.NOT_FOUND };
    await this.messageRealtime.publishRecipients({ messageId: created.message.id, conversationId: created.message.conversationId, senderAccountId: created.message.senderAccountId, recipientAccountIds: created.recipientAccountIds });
    return created.message;
  }

  @Get('/notifications')
  async listNotifications(
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'notification-list' });
    return { notifications: await this.notifications.listForAccount(principal.accountId) };
  }

  @Post('/notifications/:notificationId/read')
  async markNotificationRead(
    @Param('notificationId') notificationId: string,
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'notification-read' });
    const updated = await this.notifications.markReadForAccount(notificationId, principal.accountId);
    if (!updated) return { statusCode: HttpStatus.NOT_FOUND };
    return { updated: true };
  }
}
