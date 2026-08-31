import { Controller, Headers, Patch } from '@nestjs/common';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AuthenticatedAccountActivationService } from './authenticated-account-activation.service.js';

@Controller('accounts')
export class AuthenticatedAccountActivationController {
  constructor(
    private readonly activation: AuthenticatedAccountActivationService,
    private readonly principalResolver: RequestPrincipalResolver,
  ) {}

  @Patch('authenticated/activation')
  async activate(
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: requestId ?? 'account-activation-authenticated',
    });

    return this.activation.activate(principal);
  }
}
