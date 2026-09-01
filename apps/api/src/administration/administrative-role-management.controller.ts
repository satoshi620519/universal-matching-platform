import { BadRequestException, Body, Controller, Headers, Param, Post } from '@nestjs/common';
import type { AdministrativeRoleKey } from '@universal/domain';

import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AdministrativeRoleManagementService } from './administrative-role-management.service.js';

const roles = new Set<AdministrativeRoleKey>(['administrator', 'moderator']);
function parseIsoDate(value: unknown, field: string): Date | undefined { if (value === undefined) return undefined; if (typeof value !== 'string') throw new BadRequestException(`${field} must be an ISO date string`); const date = new Date(value); if (Number.isNaN(date.getTime())) throw new BadRequestException(`${field} must be an ISO date string`); return date; }
function parseRole(value: unknown): AdministrativeRoleKey { if (typeof value !== 'string' || !roles.has(value as AdministrativeRoleKey)) throw new BadRequestException('role is invalid'); return value as AdministrativeRoleKey; }

@Controller('administration/roles')
export class AdministrativeRoleManagementController {
  constructor(private readonly principalResolver: RequestPrincipalResolver, private readonly roles: AdministrativeRoleManagementService) {}

  @Post('accounts/:accountId/assign')
  async assign(@Param('accountId') accountId: string, @Body() body: { role?: unknown; effectiveAt?: unknown; expiresAt?: unknown }, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationHeader?: string) {
    if (!accountId.trim()) throw new BadRequestException('accountId is required');
    const effectiveAt = parseIsoDate(body?.effectiveAt, 'effectiveAt'); const expiresAt = parseIsoDate(body?.expiresAt, 'expiresAt');
    if (effectiveAt && expiresAt && expiresAt <= effectiveAt) throw new BadRequestException('expiresAt must be after effectiveAt');
    const correlationId = correlationHeader?.trim() || undefined;
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: correlationId ?? 'administration-role-assign' });
    await this.roles.assign({ actorId: principal.accountId, accountId, role: parseRole(body?.role), ...(effectiveAt ? { effectiveAt } : {}), ...(expiresAt ? { expiresAt } : {}), ...(correlationId ? { correlationId } : {}) });
    return { assigned: true };
  }

  @Post('accounts/:accountId/:role/revoke')
  async revoke(@Param('accountId') accountId: string, @Param('role') role: string, @Body() body: { revokedAt?: unknown }, @Headers('authorization') authorization?: string, @Headers('x-correlation-id') correlationHeader?: string) {
    if (!accountId.trim()) throw new BadRequestException('accountId is required');
    const revokedAt = parseIsoDate(body?.revokedAt, 'revokedAt'); const correlationId = correlationHeader?.trim() || undefined;
    const principal = await this.principalResolver.requireAuthenticated({ authorization, requestId: correlationId ?? 'administration-role-revoke' });
    return { revoked: await this.roles.revoke({ actorId: principal.accountId, accountId, role: parseRole(role), ...(revokedAt ? { revokedAt } : {}), ...(correlationId ? { correlationId } : {}) }) };
  }
}
