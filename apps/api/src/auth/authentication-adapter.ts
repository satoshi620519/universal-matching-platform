import type { RequestPrincipal } from './request-principal.js';

export interface AuthenticationAdapter {
  authenticate(input: {
    readonly authorization?: string;
    readonly requestId: string;
  }): Promise<RequestPrincipal | undefined>;
}

export abstract class RequestAuthenticationAdapter implements AuthenticationAdapter {
  abstract authenticate(input: {
    readonly authorization?: string;
    readonly requestId: string;
  }): Promise<RequestPrincipal | undefined>;
}
