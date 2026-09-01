import { Body, Controller, Get, Headers, HttpStatus, Param, Post } from '@nestjs/common';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { PrismaConversationRepository } from './prisma-conversation.repository.js';
import { PrismaMessageRepository } from './prisma-message.repository.js';

@Controller('conversations')
export class MessagingController {
  constructor(
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly conversations: PrismaConversationRepository,
    private readonly messages: PrismaMessageRepository,
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
    const message = await this.messages.createForParticipant({ conversationId, senderAccountId: principal.accountId, body: body.body ?? '' });
    if (!message) return { statusCode: HttpStatus.NOT_FOUND };
    return message;
  }
}
