import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { loadRuntimeConfig } from './config/runtime-config.js';
import { configureHttpApplication } from './http-application.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const config = loadRuntimeConfig();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  configureHttpApplication(app);

  await app.listen({ port: config.port, host: config.host });
}

void bootstrap();
