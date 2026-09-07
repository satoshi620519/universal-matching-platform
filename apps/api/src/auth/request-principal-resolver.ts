import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestAuthenticationAdapter } from './authentication-adapter.js';
import { isAuthenticatedPrincipal, type RequestPrincipal } from './request-principal.js';

@Injectable()
export class RequestPrincipalResolver {
  constructor(
    private readonly authentication: RequestAuthenticationAdapter,
  ) {}

  async resolveAccountId(request: { readonly headers?: { readonly authorization?: string | readonly string[] | undefined } }): Promise<string | null> {
    const value = request.headers?.authorization;
    const authorization = Array.isArray(value) ? value[0] : value;
    try {
      const principal = await this.requireAuthenticated({ authorization, requestId: 'request-principal-resolve' });
      return principal.accountId;
    } catch (error) {
      if (error instanceof UnauthorizedException) return null;
      throw error;
    }
  }

  async requireAuthenticated(input: {
    readonly authorization?: string;
    readonly requestId: string;
  }): Promise<RequestPrincipal> {
    const principal = await this.authentication.authenticate(input);

    if (!isAuthenticatedPrincipal(principal)) {
      throw new UnauthorizedException('authentication is required');
    }

    return principal;
  }
}
