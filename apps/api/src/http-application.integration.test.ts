import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { describe, expect, it } from 'vitest';

import { ApiErrorFilter } from './common/errors/api-error.filter.js';
import { AppModule } from './app.module.js';
import { RequestAuthenticationAdapter } from './auth/authentication-adapter.js';
import { createRequestPrincipalResolver } from './auth/request-principal.middleware.js';
import {
  CORRELATION_ID_HEADER,
  resolveCorrelationId,
} from './observability/request-context.js';

describe('HTTP application boundary', () => {
  async function createApp(): Promise<{
    app: NestFastifyApplication;
    getLastError: () => Error | undefined;
  }> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    let lastError: Error | undefined;

    app.useGlobalFilters(new ApiErrorFilter());
    const adapter = app.get(RequestAuthenticationAdapter);
    const resolvePrincipal = createRequestPrincipalResolver(adapter);
    app.getHttpAdapter().getInstance().addHook('onRequest', async (request, reply) => {
      const correlationId = resolveCorrelationId(
        request.headers[CORRELATION_ID_HEADER],
      );
      reply.header(CORRELATION_ID_HEADER, correlationId);
      await resolvePrincipal(request);
    });
    app.getHttpAdapter().getInstance().addHook('onError', async (_request, _reply, error) => {
      lastError = error;
    });

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    return {
      app,
      getLastError: () => lastError,
    };
  }

  it('serves health and preserves an incoming correlation id', async () => {
    const { app, getLastError } = await createApp();

    try {
      const correlationId = 'integration-correlation-id';
      const response = await app.getHttpAdapter().getInstance().inject({
        method: 'GET',
        url: '/health',
        headers: {
          [CORRELATION_ID_HEADER]: correlationId,
        },
      });

      expect(response.statusCode, `${response.body}\n${getLastError()?.stack ?? ''}`).toBe(200);
      expect(response.json()).toEqual({
        status: 'ok',
        database: 'configured',
      });
      expect(response.headers[CORRELATION_ID_HEADER]).toBe(correlationId);
    } finally {
      await app.close();
    }
  });

  it('generates a correlation id when the request does not provide one', async () => {
    const { app, getLastError } = await createApp();

    try {
      const response = await app.getHttpAdapter().getInstance().inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode, `${response.body}\n${getLastError()?.stack ?? ''}`).toBe(200);
      expect(response.headers[CORRELATION_ID_HEADER]).toEqual(expect.any(String));
      expect(response.headers[CORRELATION_ID_HEADER]).not.toBe('');
    } finally {
      await app.close();
    }
  });
});
