import type { RequestPrincipal } from './request-principal.js';

export interface AuthenticatedRequestContext {
  readonly principal: RequestPrincipal;
  readonly correlationId: string;
}

export function createAuthenticatedRequestContext(
  principal: RequestPrincipal | undefined,
  correlationId: string,
): AuthenticatedRequestContext {
  if (!principal) {
    throw new Error('Authenticated request principal is required');
  }

  return { principal, correlationId };
}
