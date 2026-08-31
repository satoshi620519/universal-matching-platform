import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { loadRuntimeConfig } from './config/runtime-config.js';
import {
  CORRELATION_ID_HEADER,
  resolveCorrelationId,
} from './observability/request-context.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const config = loadRuntimeConfig();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.getHttpAdapter().getInstance().addHook('onRequest', (request, reply, done) => {
    const correlationId = resolveCorrelationId(
      request.headers[CORRELATION_ID_HEADER],
    );
    reply.header(CORRELATION_ID_HEADER, correlationId);
    done();
  });

  await app.listen({ port: config.port, host: config.host });
}

void bootstrap();
