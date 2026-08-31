import type { FastifyRequest } from 'fastify';
import type { RequestPrincipal } from './request-principal.js';

export type AuthenticatedFastifyRequest = FastifyRequest & {
  principal?: RequestPrincipal;
};

export function setRequestPrincipal(
  request: AuthenticatedFastifyRequest,
  principal: RequestPrincipal,
): void {
  request.principal = principal;
}

export function getRequestPrincipal(
  request: AuthenticatedFastifyRequest,
): RequestPrincipal | undefined {
  return request.principal;
}
