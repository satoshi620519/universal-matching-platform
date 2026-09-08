import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestAuthenticationAdapter } from './authentication-adapter.js';
import { AnalyticsEventRecordingService } from '../analytics/analytics-event-recording.service.js';
import { isAuthenticatedPrincipal, type RequestPrincipal } from './request-principal.js';

@Injectable()
export class RequestPrincipalResolver {
  constructor(
    private readonly authentication: RequestAuthenticationAdapter,
    private readonly analytics?: AnalyticsEventRecordingService,
  ) {}

  async requireAuthenticated(input: {
    readonly authorization?: string;
    readonly requestId: string;
  }): Promise<RequestPrincipal> {
    const principal = await this.authentication.authenticate(input);

    if (!isAuthenticatedPrincipal(principal)) {
      throw new UnauthorizedException('authentication is required');
    }

    await this.analytics?.recordAuthenticatedLifecycle(principal.accountId);
    return principal;
  }
}
