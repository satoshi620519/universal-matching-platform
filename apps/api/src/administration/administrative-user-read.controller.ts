import { BadRequestException, Controller, Get, Query, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AdministrativeUserReadService } from './administrative-user-read.service.js';

@Controller('administration/users')
export class AdministrativeUserReadController {
  constructor(
    private readonly principals: RequestPrincipalResolver,
    private readonly users: AdministrativeUserReadService,
  ) {}

  @Get()
  async list(
    @Req() request: Request,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const accountId = await this.principals.resolveAccountId(request);
    if (!accountId) throw new UnauthorizedException();

    const parsedLimit = limit === undefined ? undefined : Number(limit);
    if (parsedLimit !== undefined && (!Number.isInteger(parsedLimit) || parsedLimit < 1)) {
      throw new BadRequestException('limit must be a positive integer');
    }

    return this.users.list({ accountId, cursor, limit: parsedLimit });
  }
}
