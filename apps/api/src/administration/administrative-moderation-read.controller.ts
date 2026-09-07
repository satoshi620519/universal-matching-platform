import { BadRequestException, Controller, Get, Query, Req, UnauthorizedException } from '@nestjs/common';
type Request = { readonly headers?: { readonly authorization?: string | readonly string[] | undefined } };
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AdministrativeModerationReadService } from './administrative-moderation-read.service.js';

@Controller('administration/moderation')
export class AdministrativeModerationReadController {
  constructor(
    private readonly principals: RequestPrincipalResolver,
    private readonly moderation: AdministrativeModerationReadService,
  ) {}

  private async input(request: Request, cursor?: string, limit?: string) {
    const accountId = await this.principals.resolveAccountId(request);
    if (!accountId) throw new UnauthorizedException();
    const parsedLimit = limit === undefined ? undefined : Number(limit);
    if (parsedLimit !== undefined && (!Number.isInteger(parsedLimit) || parsedLimit < 1)) {
      throw new BadRequestException('limit must be a positive integer');
    }
    return { accountId, cursor, limit: parsedLimit };
  }

  @Get('reports')
  async reports(@Req() request: Request, @Query('cursor') cursor?: string, @Query('limit') limit?: string) {
    return this.moderation.listReports(await this.input(request, cursor, limit));
  }

  @Get('cases')
  async cases(@Req() request: Request, @Query('cursor') cursor?: string, @Query('limit') limit?: string) {
    return this.moderation.listCases(await this.input(request, cursor, limit));
  }
}
