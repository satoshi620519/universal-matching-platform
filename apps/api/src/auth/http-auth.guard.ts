import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { RequestAuthenticationAdapter } from './authentication-adapter.js';
import {
  getRequestPrincipal,
  type AuthenticatedFastifyRequest,
} from './authenticated-request.js';

@Injectable()
export class HttpAuthenticationGuard implements CanActivate {
  constructor(private readonly adapter: RequestAuthenticationAdapter) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedFastifyRequest>();

    const principal = getRequestPrincipal(request);

    if (!principal) {
      throw new HttpException('Authentication required', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
