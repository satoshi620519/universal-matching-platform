import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { loadRuntimeConfig } from './config/runtime-config.js';
import { ApiErrorFilter } from './common/errors/api-error.filter.js';
import { RequestAuthenticationAdapter } from './auth/authentication-adapter.js';
import { createRequestPrincipalResolver } from './auth/request-principal.middleware.js';
import { CORRELATION_ID_HEADER, resolveCorrelationId } from './observability/request-context.js';
import { AppModule } from './app.module.js';

export function configureHttpApplication(app: NestFastifyApplication): void {
  app.useGlobalFilters(new ApiErrorFilter());

  const adapter = app.get(RequestAuthenticationAdapter);
  const resolvePrincipal = createRequestPrincipalResolver(adapter);

  app.getHttpAdapter().getInstance().addHook('onRequest', async (request, reply) => {
    const correlationId = resolveCorrelationId(request.headers[CORRELATION_ID_HEADER]);
    reply.header(CORRELATION_ID_HEADER, correlationId);
    await resolvePrincipal(request);
  });
}

async function bootstrap() {
  const config = loadRuntimeConfig();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  configureHttpApplication(app);

  await app.listen({ port: config.port, host: config.host });
}

void bootstrap();
