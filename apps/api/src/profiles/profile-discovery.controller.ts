import { BadRequestException, Body, Controller, Get, Headers, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { CategoryService } from './category.service.js';
import { CategoryFieldSchemaService } from './category-field-schema.service.js';
import { ProfileService } from './profile.service.js';
import { AdministrativeCapabilityAccessService } from '../administration/administrative-capability-access.service.js';
import { DiscoveryService } from './discovery.service.js';
import { PrismaProfileRepository } from './prisma-profile.repository.js';
import { PrismaMatchTransitionRepository } from '../matching/prisma-match-transition.repository.js';
import { LocalizationConfigurationService } from '../configuration/localization-configuration.service.js';
import { LocationPrecisionConfigurationService } from '../configuration/location-precision-configuration.service.js';
import { DistanceMatchingConfigurationService } from '../configuration/distance-matching-configuration.service.js';
import { createDiscoverySort, createGeographicScope, projectProfile, type ProfileFieldSchema, type ProfileProjectionPolicy, type ProfileCoreProjectionPolicy, type ProfileVerificationStatus } from '@universal/domain';

const DEFAULT_FIELD_SCHEMA: ProfileFieldSchema = {
  displayName: { kind: 'string', required: true, minLength: 1, maxLength: 80 },
  headline: { kind: 'string', maxLength: 240 },
  bio: { kind: 'string', maxLength: 2000 },
};
const PUBLIC_PROJECTION: ProfileProjectionPolicy = { displayName: 'public', headline: 'public', bio: 'public' };
const PUBLIC_CORE_PROJECTION: ProfileCoreProjectionPolicy = { avatar: 'public', gallery: 'public', biography: 'public', verificationStatus: 'public' };

@Controller()
export class ProfileDiscoveryController {
  constructor(
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly categories: CategoryService,
    private readonly schemas: CategoryFieldSchemaService,
    private readonly profiles: ProfileService,
    private readonly profileRepository: PrismaProfileRepository,
    private readonly discovery: DiscoveryService,
    private readonly matches: PrismaMatchTransitionRepository,
    private readonly admin: AdministrativeCapabilityAccessService,
    private readonly localization: LocalizationConfigurationService,
    private readonly locationPrecision: LocationPrecisionConfigurationService,
    private readonly distanceMatching: DistanceMatchingConfigurationService,
  ) {}

  @Get('profile-categories')
  async listCategories() { return { categories: (await this.categories.list()).map(category => ({ ...category, fieldSchema: this.schemas.schemaFor(category.key) })) }; }

  @Post('profiles/me')
  async createMyProfile(@Body() body: { categoryId?: string; fields?: Record<string, string | number | boolean | null>; geographicScope?: { kind?: string; countryCode?: string; regionCode?: string; localityCode?: string }; avatar?: { id: string; storageKey: string; status: 'pending' | 'active' | 'removed' } | null; gallery?: readonly { id: string; storageKey: string; status: 'pending' | 'active' | 'removed' }[]; biography?: string | null }, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'profile-create' });
    const geographicScope = this.scope(body.geographicScope);
    await this.requireSupportedGeography(geographicScope);
    return this.profiles.create({ accountId: principal.accountId, categoryId: body.categoryId ?? '', fields: body.fields ?? {}, fieldSchema: await this.schemaFor(body.categoryId), geographicScope, avatar: body.avatar, gallery: body.gallery, biography: body.biography });
  }

  @Patch('profiles/me/metadata')
  async updateMyProfileMetadata(@Body() body: { avatar?: { id: string; storageKey: string; status: 'pending' | 'active' | 'removed' } | null; gallery?: readonly { id: string; storageKey: string; status: 'pending' | 'active' | 'removed' }[]; biography?: string | null }, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'profile-metadata-update' });
    const existing = await this.profileRepository.findByAccountId(principal.accountId);
    if (!existing) throw new NotFoundException('profile not found');
    return this.profiles.update(existing.id, {
      avatar: body.avatar,
      gallery: body.gallery,
      biography: body.biography,
    });
  }

  @Post('moderation/profiles/:accountId/verification')
  async transitionVerification(@Param('accountId') accountId: string, @Body() body: { status?: unknown }, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'profile-verification-transition' });
    await this.admin.require(principal.accountId, 'manage-moderation');
    const allowed = new Set<ProfileVerificationStatus>(['unverified', 'pending', 'verified', 'rejected']);
    if (typeof body.status !== 'string' || !allowed.has(body.status as ProfileVerificationStatus)) throw new BadRequestException('verification status is invalid');
    const existing = await this.profileRepository.findByAccountId(accountId);
    if (!existing) throw new NotFoundException('profile not found');
    return this.profiles.update(existing.id, { verificationStatus: body.status as ProfileVerificationStatus });
  }

  @Get('profiles/me/completion')
  async getMyProfileCompletion(@Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'profile-completion' });
    const existing = await this.profileRepository.findByAccountId(principal.accountId);
    if (!existing) throw new NotFoundException('profile not found');
    const category = (await this.categories.list()).find(item => item.id === existing.categoryId);
    if (!category) throw new NotFoundException('profile category not found');
    return this.profiles.completion(existing.id, { schema: this.completionSchema(this.schemas.schemaFor(category.key)) });
  }

  @Get('profiles/me')
  async getMyProfile(@Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'profile-me' });
    const existing = await this.profileRepository.findByAccountId(principal.accountId);
    if (!existing) throw new NotFoundException('profile not found');
    return existing;
  }

  @Get('profiles/:accountId')
  async getPublicProfile(@Param('accountId') accountId: string, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'profile-public' });
    const profile = await this.profileRepository.findByAccountId(accountId);
    if (!profile) throw new NotFoundException('profile not found');
    const fieldSchema = await this.schemaFor(profile.categoryId);
    const projectionPolicy: ProfileProjectionPolicy = Object.fromEntries(
      Object.entries(fieldSchema).map(([key, rule]) => [key, rule.visibility ?? 'public']),
    );
    return projectProfile(
      profile,
      { accountId: principal.accountId, privileged: await this.admin.can(principal.accountId, 'manage-moderation') },
      projectionPolicy,
      PUBLIC_CORE_PROJECTION,
      await this.locationPrecision.resolve(),
    );
  }

  @Patch('profiles/me')
  async updateMyProfile(@Body() body: { categoryId?: string; fields?: Record<string, string | number | boolean | null>; geographicScope?: { kind?: string; countryCode?: string; regionCode?: string; localityCode?: string }; avatar?: { id: string; storageKey: string; status: 'pending' | 'active' | 'removed' } | null; gallery?: readonly { id: string; storageKey: string; status: 'pending' | 'active' | 'removed' }[]; biography?: string | null }, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'profile-update' });
    const existing = await this.profileRepository.findByAccountId(principal.accountId);
    if (!existing) throw new NotFoundException('profile not found');
    const categoryId = body.categoryId ?? existing.categoryId;
    const categoryChanged = categoryId !== existing.categoryId;
    const fieldSchema = (body.fields !== undefined || categoryChanged) ? await this.schemaFor(categoryId) : undefined;
    const geographicScope = body.geographicScope ? this.scope(body.geographicScope) : undefined;
    if (geographicScope) await this.requireSupportedGeography(geographicScope);
    return this.profiles.update(existing.id, { categoryId: body.categoryId, fields: body.fields, fieldSchema, geographicScope, avatar: body.avatar, gallery: body.gallery, biography: body.biography });
  }

  @Get('discovery')
  async discover(@Query('categoryId') categoryId: string, @Query('scope') scope = 'global', @Query('countryCode') countryCode: string | undefined, @Query('regionCode') regionCode: string | undefined, @Query('localityCode') localityCode: string | undefined, @Query('limit') limit = '20', @Query('cursor') cursor: string | undefined, @Query('maxDistanceMeters') maxDistanceMeters: string | undefined, @Query('sort') sort: 'id' | 'compatibilityScore' | undefined, @Query('direction') direction: 'asc' | 'desc' | undefined, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'discovery' });
    const geographicScope = this.scope({ kind: scope, countryCode, regionCode, localityCode });
    await this.requireSupportedGeography(geographicScope);
    const projectionPolicy = await this.schemaFor(categoryId);
    const distanceConstraint = maxDistanceMeters === undefined ? undefined : { maxDistanceMeters: Number(maxDistanceMeters) };
    if (distanceConstraint && !await this.distanceMatching.isEnabled()) {
      throw new BadRequestException('distance matching is disabled by deployment configuration');
    }
    return this.discovery.discover({
      subjectAccountId: principal.accountId,
      categoryId,
      geographicScope,
      limit: Number(limit),
      cursor,
      distanceConstraint,
      sort: createDiscoverySort(sort === undefined && direction === undefined ? undefined : { key: sort ?? 'id', direction: direction ?? 'asc' }),
      projectionPolicy: Object.fromEntries(Object.entries(projectionPolicy).map(([key, rule]) => [key, rule.visibility ?? 'public'])),
      locationPolicy: await this.locationPrecision.resolve(),
    });
  }

  @Post('matches/decision')
  async decide(@Body() body: { targetAccountId?: string; decision?: 'like' | 'pass'; idempotencyKey?: string }, @Headers('authorization') authorization?: string, @Headers('x-request-id') requestId?: string) {
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'match-decision' });
    return this.matches.transition({ actorAccountId: principal.accountId, targetAccountId: body.targetAccountId ?? '', decision: body.decision ?? 'pass', idempotencyKey: body.idempotencyKey ?? randomUUID() });
  }

  private async requireSupportedGeography(scope: ReturnType<typeof createGeographicScope>): Promise<void> {
    if (scope.kind === 'global') return;
    const configuration = await this.localization.resolve();
    if (!configuration.supportedCountries.includes(scope.countryCode)) {
      throw new BadRequestException('countryCode is not supported by deployment localization configuration');
    }
  }

  private completionSchema(fieldSchema: ProfileFieldSchema) {
    return {
      fields: Object.entries(fieldSchema).map(([key, rule]) => ({
        key,
        label: key,
        type: rule.kind === 'number' ? 'number' as const : rule.kind === 'boolean' ? 'boolean' as const : 'text' as const,
        required: rule.required === true,
        visibility: 'owner' as const,
      })),
    };
  }

  private async schemaFor(categoryId?: string): Promise<ProfileFieldSchema> {
    const category = (await this.categories.list()).find(item => item.id === categoryId);
    if (!category) throw new NotFoundException('profile category not found');
    return this.schemas.schemaFor(category.key);
  }

  private scope(input?: { kind?: string; countryCode?: string; regionCode?: string; localityCode?: string }) {
    if (input?.kind === 'city' && input.countryCode && input.regionCode && input.localityCode) return createGeographicScope({ kind:'city', countryCode: input.countryCode, regionCode: input.regionCode, localityCode: input.localityCode });
    if (input?.kind === 'region' && input.countryCode && input.regionCode) return createGeographicScope({ kind:'region', countryCode: input.countryCode, regionCode: input.regionCode });
    if (input?.kind === 'country' && input.countryCode) return createGeographicScope({ kind:'country', countryCode: input.countryCode });
    return createGeographicScope({ kind:'global' });
  }
}
