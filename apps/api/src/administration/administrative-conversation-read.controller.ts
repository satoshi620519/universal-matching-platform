import { BadRequestException, Controller, Get, Query, Req, UnauthorizedException } from '@nestjs/common';
type Request = { readonly headers?: { readonly authorization?: string | readonly string[] | undefined } };
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AdministrativeConversationReadService } from './administrative-conversation-read.service.js';

@Controller('administration/conversations')
export class AdministrativeConversationReadController {
  constructor(private readonly principals: RequestPrincipalResolver, private readonly conversations: AdministrativeConversationReadService) {}
  @Get()
  async list(@Req() request: Request, @Query('cursor') cursor?: string, @Query('limit') limit?: string) {
    const accountId = await this.principals.resolveAccountId(request);
    if (!accountId) throw new UnauthorizedException();
    const parsed = limit === undefined ? undefined : Number(limit);
    if (parsed !== undefined && (!Number.isInteger(parsed) || parsed < 1)) throw new BadRequestException('limit must be a positive integer');
    return this.conversations.list({ accountId, cursor, limit: parsed });
  }
}
