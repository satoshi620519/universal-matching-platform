import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { RequestAuthenticationAdapter } from './authentication-adapter.js';
import { resolveCorrelationId, CORRELATION_ID_HEADER } from '../observability/request-context.js';

@Injectable()
export class HttpAuthenticationGuard implements CanActivate {
  constructor(private readonly adapter: RequestAuthenticationAdapter) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const correlationId = resolveCorrelationId(
      request.headers[CORRELATION_ID_HEADER],
    );

    const principal = await this.adapter.authenticate({
      authorization: request.headers.authorization,
      requestId: correlationId,
    });

    if (!principal) {
      throw new HttpException('Authentication required', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
