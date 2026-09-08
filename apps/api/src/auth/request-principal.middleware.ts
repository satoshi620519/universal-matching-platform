import type { FastifyRequest } from 'fastify';
import { RequestAuthenticationAdapter } from './authentication-adapter.js';
import {
  setRequestPrincipal,
  type AuthenticatedFastifyRequest,
} from './authenticated-request.js';
import {
  CORRELATION_ID_HEADER,
  resolveCorrelationId,
} from '../observability/request-context.js';
import { readAdminSessionCookie } from './session-cookie.js';
import { AnalyticsEventRecordingService } from '../analytics/analytics-event-recording.service.js';

export function createRequestPrincipalResolver(
  adapter: RequestAuthenticationAdapter,
  analytics?: AnalyticsEventRecordingService,
) {
  return async (request: FastifyRequest): Promise<void> => {
    const correlationId = resolveCorrelationId(
      request.headers[CORRELATION_ID_HEADER],
    );

    const authorization = request.headers.authorization;
    const cookieCredential = readAdminSessionCookie(request.headers.cookie);

    const principal = await adapter.authenticate({
      authorization: authorization ?? (cookieCredential ? `Bearer ${cookieCredential}` : undefined),
      requestId: correlationId,
    });

    if (principal) {
      setRequestPrincipal(
        request as AuthenticatedFastifyRequest,
        principal,
      );
      void analytics?.recordActivity(principal.accountId, { source: 'authenticated_request' });
      void analytics?.recordRetentionCheckin(principal.accountId);
    }
  };
}
