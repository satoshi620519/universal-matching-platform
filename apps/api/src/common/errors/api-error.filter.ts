import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { CORRELATION_ID_HEADER, resolveCorrelationId } from '../../observability/request-context.js';

interface ErrorResponse {
  readonly statusCode: number;
  readonly code: string;
  readonly message: string;
  readonly correlationId: string;
}

@Catch()
export class ApiErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<FastifyRequest>();
    const reply = context.getResponse<FastifyReply>();

    const correlationId = resolveCorrelationId(
      request.headers[CORRELATION_ID_HEADER],
    );

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const response: ErrorResponse = {
      statusCode: status,
      code: exception instanceof HttpException ? 'HTTP_ERROR' : 'INTERNAL_ERROR',
      message:
        exception instanceof HttpException
          ? String(exception.message)
          : 'An unexpected error occurred',
      correlationId,
    };

    reply.header(CORRELATION_ID_HEADER, correlationId).status(status).send(response);
  }
}
