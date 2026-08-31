import type { FastifyRequest } from 'fastify';
import { RequestAuthenticationAdapter } from './authentication-adapter.js';
import {
  setRequestPrincipal,
  type AuthenticatedFastifyRequest,
} from './authenticated-request.js';
import {
  CORRELATION_ID_HEADER,
  resolveCorrelationId,
} from '../observability/request-context.js';

export function createRequestPrincipalResolver(
  adapter: RequestAuthenticationAdapter,
) {
  return async (request: FastifyRequest): Promise<void> => {
    const correlationId = resolveCorrelationId(
      request.headers[CORRELATION_ID_HEADER],
    );

    const principal = await adapter.authenticate({
      authorization: request.headers.authorization,
      requestId: correlationId,
    });

    if (principal) {
      setRequestPrincipal(
        request as AuthenticatedFastifyRequest,
        principal,
      );
    }
  };
}
