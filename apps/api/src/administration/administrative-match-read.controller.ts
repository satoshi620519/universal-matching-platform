import { BadRequestException, Controller, Get, Query, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AdministrativeMatchReadService } from './administrative-match-read.service.js';

@Controller('administration/matches')
export class AdministrativeMatchReadController {
  constructor(private readonly principals: RequestPrincipalResolver, private readonly matches: AdministrativeMatchReadService) {}
  @Get()
  async list(@Req() request: Request, @Query('cursor') cursor?: string, @Query('limit') limit?: string) {
    const accountId = await this.principals.resolveAccountId(request);
    if (!accountId) throw new UnauthorizedException();
    const parsed = limit === undefined ? undefined : Number(limit);
    if (parsed !== undefined && (!Number.isInteger(parsed) || parsed < 1)) throw new BadRequestException('limit must be a positive integer');
    return this.matches.list({ accountId, cursor, limit: parsed });
  }
}
