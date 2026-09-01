import { Body, Controller, Get, Headers, Patch, Post, Query } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { CategoryService } from './category.service.js';
import { ProfileService } from './profile.service.js';
import { DiscoveryService } from './discovery.service.js';
import { PrismaProfileRepository } from './prisma-profile.repository.js';
import { PrismaMatchTransitionRepository } from '../matching/prisma-match-transition.repository.js';
import { createGeographicScope, type ProfileFieldSchema, type ProfileProjectionPolicy } from '@universal/domain';

const DEFAULT_FIELD_SCHEMA: ProfileFieldSchema = {
  displayName: { kind: 'string', required: true, minLength: 1, maxLength: 80 },
  headline: { kind: 'string', maxLength: 240 },
  bio: { kind: 'string', maxLength: 2000 },
};
const PUBLIC_PROJECTION: ProfileProjectionPolicy = { displayName: 'public', headline: 'public', bio: 'public' };

@Controller()
export class ProfileDiscoveryController {
  constructor(
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly categories: CategoryService,
    private readonly profiles: ProfileService,
    private readonly profileRepository: PrismaProfileRepository,
    private readonly discovery: DiscoveryService,
    private readonly matches: PrismaMatchTransitionRepository,
  ) {}

  @Get('profile-categories')
  async listCategories() { return { categories: await this.categories.list() }; }

  @Post('profiles/me')
  async createMyProfile(@Body() body: { categoryId?: string; fields?: Record<string, string | number | boolean | null>; geographicScope?: { kind?: string; countryCode?: string; regionCode?: string } }, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'profile-create' });
    return this.profiles.create({ accountId: principal.accountId, categoryId: body.categoryId ?? '', fields: body.fields ?? {}, fieldSchema: DEFAULT_FIELD_SCHEMA, geographicScope: this.scope(body.geographicScope) });
  }

  @Get('profiles/me')
  async getMyProfile(@Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'profile-me' });
    return this.profileRepository.findByAccountId(principal.accountId);
  }

  @Patch('profiles/me')
  async updateMyProfile(@Body() body: { categoryId?: string; fields?: Record<string, string | number | boolean | null>; geographicScope?: { kind?: string; countryCode?: string; regionCode?: string } }, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'profile-update' });
    const existing = await this.profileRepository.findByAccountId(principal.accountId);
    if (!existing) throw new Error('profile not found');
    return this.profiles.update(existing.id, { categoryId: body.categoryId, fields: body.fields, fieldSchema: body.fields ? DEFAULT_FIELD_SCHEMA : undefined, geographicScope: body.geographicScope ? this.scope(body.geographicScope) : undefined });
  }

  @Get('discovery')
  async discover(@Query('categoryId') categoryId: string, @Query('scope') scope = 'global', @Query('countryCode') countryCode: string | undefined, @Query('limit') limit = '20', @Query('cursor') cursor: string | undefined, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'discovery' });
    const geographicScope = scope === 'country' && countryCode ? createGeographicScope({ kind:'country', countryCode }) : createGeographicScope({ kind:'global' });
    return this.discovery.discover({ subjectAccountId: principal.accountId, categoryId, geographicScope, limit: Number(limit), cursor, projectionPolicy: PUBLIC_PROJECTION });
  }

  @Post('matches/decision')
  async decide(@Body() body: { targetAccountId?: string; decision?: 'like' | 'pass'; idempotencyKey?: string }, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'match-decision' });
    return this.matches.transition({ actorAccountId: principal.accountId, targetAccountId: body.targetAccountId ?? '', decision: body.decision ?? 'pass', idempotencyKey: body.idempotencyKey ?? randomUUID() });
  }

  private scope(input?: { kind?: string; countryCode?: string; regionCode?: string }) {
    if (input?.kind === 'country' && input.countryCode) return createGeographicScope({ kind:'country', countryCode: input.countryCode });
    if (input?.kind === 'region' && input.countryCode && input.regionCode) return createGeographicScope({ kind:'region', countryCode: input.countryCode, regionCode: input.regionCode });
    return createGeographicScope({ kind:'global' });
  }
}
