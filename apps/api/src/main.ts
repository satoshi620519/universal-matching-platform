import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { loadRuntimeConfig } from './config/runtime-config.js';
import { configureHttpApplication } from './http-application.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const config = loadRuntimeConfig();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { rawBody: true });

  const origins = (process.env.CORS_ORIGINS ?? '*').split(',').map((origin) => origin.trim()).filter(Boolean);
  app.enableCors({
    origin: origins.length === 1 && origins[0] === '*' ? true : origins,
    credentials: true,
  });

  configureHttpApplication(app);
  await app.listen({ port: config.port, host: config.host });
}

void bootstrap();
