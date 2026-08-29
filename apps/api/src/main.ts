import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Module, Controller, Get } from '@nestjs/common';
@Controller('health')
class HealthController { @Get() health() { return { status: 'ok' }; } }
@Module({ controllers: [HealthController] })
class AppModule {}
async function bootstrap() { const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter()); await app.listen({ port: Number(process.env.PORT ?? 3001), host: '0.0.0.0' }); }
void bootstrap();
