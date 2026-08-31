import { Controller, Headers, Patch } from '@nestjs/common';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { AuthenticatedAccountDeletionRequestService } from './authenticated-account-deletion-request.service.js';

@Controller('accounts')
export class AuthenticatedAccountDeletionRequestController {
  constructor(
    private readonly deletion: AuthenticatedAccountDeletionRequestService,
    private readonly principalResolver: RequestPrincipalResolver,
  ) {}

  @Patch('authenticated/deletion-request')
  async requestDeletion(
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const principal = await this.principalResolver.requireAuthenticated({
      authorization,
      requestId: requestId ?? 'account-deletion-request',
    });

    return this.deletion.requestDeletion(principal);
  }
}
