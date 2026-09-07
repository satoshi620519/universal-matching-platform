import { Body, Controller, Post, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { RelationshipBlockService } from './relationship-block.service.js';

@Controller('safety/blocks')
export class RelationshipBlockController {
  constructor(private readonly principals: RequestPrincipalResolver, private readonly blocks: RelationshipBlockService) {}
  @Post()
  async block(@Req() request: Request, @Body() body: { accountId?: string }) {
    const blockerAccountId = await this.principals.resolveAccountId(request);
    if (!blockerAccountId) throw new UnauthorizedException();
    if (!body?.accountId || typeof body.accountId !== 'string') throw new BadRequestException('accountId is required.');
    return this.blocks.block({ blockerAccountId, blockedAccountId: body.accountId });
  }
}
import { BadRequestException } from '@nestjs/common';
