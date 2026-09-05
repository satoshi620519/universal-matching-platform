import { Body, Controller, ForbiddenException, Delete, Get, Headers, HttpStatus, Optional, Param, Post } from '@nestjs/common';
import { blocksCapability } from '@universal/domain';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { PrismaConversationRepository } from './prisma-conversation.repository.js';
import { PrismaMessageRepository } from './prisma-message.repository.js';
import { PrismaNotificationRepository } from './prisma-notification.repository.js';
import { MessageRealtimePublicationService } from './message-realtime-publication.service.js';
import { PrismaMatchTransitionRepository } from '../matching/prisma-match-transition.repository.js';
import { EffectiveSafetyRestrictionService } from '../safety/effective-safety-restriction.service.js';
import { UserBlockRepository } from '../safety/user-block.repository.js';
import { NotificationCreationService } from './notification-creation.service.js';

@Controller('conversations')
export class MessagingController {
  constructor(private readonly principalResolver: RequestPrincipalResolver, private readonly conversations: PrismaConversationRepository, private readonly messages: PrismaMessageRepository, private readonly notifications: PrismaNotificationRepository, private readonly messageRealtime: MessageRealtimePublicationService, private readonly matches: PrismaMatchTransitionRepository, @Optional() private readonly notificationCreation?: NotificationCreationService, @Optional() private readonly safety?: EffectiveSafetyRestrictionService, @Optional() private readonly blocks?: UserBlockRepository) {}

  @Post()
  async createConversation(@Body() body: { participantAccountIds?: string[] }, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'conversation-create' });
    await this.assertCommunicationAllowed(principal.accountId);
    await this.assertParticipantsNotBlocked(principal.accountId, body.participantAccountIds ?? []);
    const participantAccountIds = [...(body.participantAccountIds ?? []), principal.accountId];
    return this.conversations.create(participantAccountIds);
  }

  @Post('from-mutual-match')
  async createConversationFromMutualMatch(@Body() body: { targetAccountId?: string }, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'conversation-mutual-match' });
    await this.assertCommunicationAllowed(principal.accountId);
    const targetAccountId = body.targetAccountId?.trim() ?? '';
    if (!targetAccountId || !(await this.matches.isMutualMatch(principal.accountId, targetAccountId))) return { statusCode: HttpStatus.NOT_FOUND };
    await this.assertParticipantsNotBlocked(principal.accountId, [targetAccountId]);
    return this.conversations.createOrFindDirect(principal.accountId, targetAccountId);
  }

  @Get(':conversationId/messages')
  async listMessages(@Param('conversationId') conversationId: string, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'message-list' });
    const messages = await this.messages.listForParticipant({ conversationId, accountId: principal.accountId });
    if (!messages) return { statusCode: HttpStatus.NOT_FOUND, messages: [] };
    return { messages };
  }

  @Post(':conversationId/messages')
  async createMessage(@Param('conversationId') conversationId: string, @Body() body: { body?: string }, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'message-create' });
    await this.assertCommunicationAllowed(principal.accountId);
    const created = await this.messages.createForParticipant({ conversationId, senderAccountId: principal.accountId, body: body.body ?? '' });
    if (!created) return { statusCode: HttpStatus.NOT_FOUND };
    await this.messageRealtime.publishRecipients({ messageId: created.message.id, conversationId: created.message.conversationId, senderAccountId: created.message.senderAccountId, recipientAccountIds: created.recipientAccountIds });
    if (this.notificationCreation) {
      await Promise.all(created.recipientAccountIds.map((accountId) => this.notificationCreation.create({
        accountId,
        kind: 'message',
        payload: { messageId: created.message.id, conversationId: created.message.conversationId, senderAccountId: created.message.senderAccountId },
      })));
    }
    return created.message;
  }

  @Post(':conversationId/read')
  async markConversationRead(@Param('conversationId') conversationId: string, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'conversation-read' });
    const updated = await this.messages.markReadForParticipant({ conversationId, accountId: principal.accountId });
    if (!updated) return { statusCode: HttpStatus.NOT_FOUND };
    return { updated: true };
  }

  @Delete(':conversationId/messages/:messageId')
  async deleteMessage(@Param('conversationId') conversationId: string, @Param('messageId') messageId: string, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'message-delete' });
    const message = await this.messages.softDeleteForSender({ messageId, senderAccountId: principal.accountId });
    if (!message) return { statusCode: HttpStatus.NOT_FOUND };
    return { deleted: true, conversationId, messageId };
  }

  @Get('/notifications')
  async listNotifications(@Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'notification-list' });
    return { notifications: await this.notifications.listForAccount(principal.accountId) };
  }

  @Get('/notifications/unread')
  async listUnreadNotifications(@Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'notification-unread-list' });
    return { notifications: await this.notifications.listUnreadForAccount(principal.accountId) };
  }

  @Post('/notifications/:notificationId/read')
  async markNotificationRead(@Param('notificationId') notificationId: string, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'notification-read' });
    const updated = await this.notifications.markReadForAccount(notificationId, principal.accountId);
    if (!updated) return { statusCode: HttpStatus.NOT_FOUND };
    return { updated: true };
  }

  private async assertParticipantsNotBlocked(actorAccountId: string, participantAccountIds: readonly string[]): Promise<void> {
    if (!this.blocks) return;
    for (const participantAccountId of participantAccountIds) {
      if (participantAccountId === actorAccountId) continue;
      const [forward, reverse] = await Promise.all([
        this.blocks.exists(actorAccountId, participantAccountId),
        this.blocks.exists(participantAccountId, actorAccountId),
      ]);
      if (forward || reverse) throw new ForbiddenException('communication is blocked between these accounts');
    }
  }

  private async assertCommunicationAllowed(accountId: string): Promise<void> {
    if (!this.safety) return;
    const restriction = await this.safety.resolveForAccount(accountId, 'communication');
    if (blocksCapability(restriction, 'communication')) throw new ForbiddenException('account is restricted from communication');
  }
}
