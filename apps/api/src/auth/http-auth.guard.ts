import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RequestAuthenticationAdapter } from './authentication-adapter.js';
import { isAuthenticatedPrincipal } from './request-principal.js';
import {
  getRequestPrincipal,
  setRequestPrincipal,
  type AuthenticatedFastifyRequest,
} from './authenticated-request.js';

@Injectable()
export class HttpAuthenticationGuard implements CanActivate {
  constructor(private readonly adapter: RequestAuthenticationAdapter) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedFastifyRequest>();

    const existingPrincipal = getRequestPrincipal(request);
    if (existingPrincipal) {
      if (!isAuthenticatedPrincipal(existingPrincipal)) {
        throw new UnauthorizedException('Authentication required');
      }
      return true;
    }

    const requestId =
      typeof request.id === 'string' && request.id.length > 0
        ? request.id
        : randomUUID();
    const principal = await this.adapter.authenticate({
      authorization:
        typeof request.headers.authorization === 'string'
          ? request.headers.authorization
          : undefined,
      requestId,
    });

    if (!isAuthenticatedPrincipal(principal)) {
      throw new UnauthorizedException('Authentication required');
    }

    setRequestPrincipal(request, principal);
    return true;
  }
}
