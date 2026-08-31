import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestAuthenticationAdapter } from './authentication-adapter.js';
import { isAuthenticatedPrincipal, type RequestPrincipal } from './request-principal.js';

@Injectable()
export class RequestPrincipalResolver {
  constructor(
    private readonly authentication: RequestAuthenticationAdapter,
  ) {}

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
