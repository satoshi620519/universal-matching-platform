import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { describe, expect, it, vi } from 'vitest';

import { ApiErrorFilter } from '../common/errors/api-error.filter.js';
import { CORRELATION_ID_HEADER } from '../observability/request-context.js';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AdministrativeRoleManagementController } from './administrative-role-management.controller.js';
import { AdministrativeRoleManagementService } from './administrative-role-management.service.js';

describe('Administrative role management HTTP boundary', () => {
  async function createApp(input?: {
    readonly requireAuthenticated?: ReturnType<typeof vi.fn>;
    readonly assign?: ReturnType<typeof vi.fn>;
    readonly revoke?: ReturnType<typeof vi.fn>;
  }): Promise<NestFastifyApplication> {
    const moduleRef = await Test.createTestingModule({
      controllers: [AdministrativeRoleManagementController],
      providers: [
        {
          provide: RequestPrincipalResolver,
          useValue: {
            requireAuthenticated:
              input?.requireAuthenticated ??
              vi.fn().mockResolvedValue({ accountId: 'admin-1' }),
          },
        },
        {
          provide: AdministrativeRoleManagementService,
          useValue: {
            assign: input?.assign ?? vi.fn().mockResolvedValue(undefined),
            revoke: input?.revoke ?? vi.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    const app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalFilters(new ApiErrorFilter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    return app;
  }

  it('returns 401 before role mutation when authentication is absent', async () => {
    const assign = vi.fn();
    const app = await createApp({
      requireAuthenticated: vi.fn().mockRejectedValue(
        new UnauthorizedException('authentication is required'),
      ),
      assign,
    });

    try {
      const response = await app.getHttpAdapter().getInstance().inject({
        method: 'POST',
        url: '/administration/roles/accounts/account-1/assign',
        payload: { role: 'moderator' },
      });

      expect(response.statusCode, response.body).toBe(401);
      expect(response.json()).toMatchObject({
        code: 'HTTP_ERROR',
        message: 'authentication is required',
      });
      expect(assign).not.toHaveBeenCalled();
    } finally {
      await app.close();
    }
  });

  it('propagates capability denial and does not report a successful mutation', async () => {
    const assign = vi.fn().mockRejectedValue(
      new ForbiddenException('administrative capability is required'),
    );
    const app = await createApp({ assign });

    try {
      const response = await app.getHttpAdapter().getInstance().inject({
        method: 'POST',
        url: '/administration/roles/accounts/account-1/assign',
        headers: { [CORRELATION_ID_HEADER]: 'admin-denied-request' },
        payload: { role: 'moderator' },
      });

      expect(response.statusCode, response.body).toBe(403);
      expect(response.json()).toMatchObject({
        code: 'HTTP_ERROR',
        message: 'administrative capability is required',
        correlationId: 'admin-denied-request',
      });
      expect(assign).toHaveBeenCalledTimes(1);
    } finally {
      await app.close();
    }
  });

  it('returns success only after the authorized application mutation resolves', async () => {
    const assign = vi.fn().mockResolvedValue(undefined);
    const app = await createApp({ assign });

    try {
      const response = await app.getHttpAdapter().getInstance().inject({
        method: 'POST',
        url: '/administration/roles/accounts/account-1/assign',
        headers: {
          authorization: 'Bearer opaque',
          [CORRELATION_ID_HEADER]: 'admin-success-request',
        },
        payload: { role: 'moderator' },
      });

      expect(response.statusCode, response.body).toBe(201);
      expect(response.json()).toEqual({ assigned: true });
      expect(assign).toHaveBeenCalledWith(
        expect.objectContaining({ correlationId: 'admin-success-request',
          actorId: 'admin-1',
          accountId: 'account-1',
          role: 'moderator',
        }),
      );
    } finally {
      await app.close();
    }
  });
});
