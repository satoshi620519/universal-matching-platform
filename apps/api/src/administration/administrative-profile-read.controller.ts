import { BadRequestException, Controller, Get, Query, Req, UnauthorizedException } from '@nestjs/common';
type Request = { readonly headers?: { readonly authorization?: string | readonly string[] | undefined } };
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AdministrativeProfileReadService } from './administrative-profile-read.service.js';

@Controller('administration/profiles')
export class AdministrativeProfileReadController {
  constructor(private readonly principals: RequestPrincipalResolver, private readonly profiles: AdministrativeProfileReadService) {}

  @Get()
  async list(@Req() request: Request, @Query('cursor') cursor?: string, @Query('limit') limit?: string) {
    const accountId = await this.principals.resolveAccountId(request);
    if (!accountId) throw new UnauthorizedException();
    const parsedLimit = limit === undefined ? undefined : Number(limit);
    if (parsedLimit !== undefined && (!Number.isInteger(parsedLimit) || parsedLimit < 1)) {
      throw new BadRequestException('limit must be a positive integer');
    }
    return this.profiles.list({ accountId, cursor, limit: parsedLimit });
  }
}
