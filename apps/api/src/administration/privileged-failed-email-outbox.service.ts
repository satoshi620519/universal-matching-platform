import { Injectable } from '@nestjs/common';

import { FailedEmailOutboxReviewService } from '../auth/failed-email-outbox-review.service.js';
import type { FailedEmailOutboxMessage } from '../auth/failed-email-outbox.repository.js';
import { AuditRecordService } from './audit-record.service.js';
import { AdministrativeCapabilityAccessService } from './administrative-capability-access.service.js';

@Injectable()
export class PrivilegedFailedEmailOutboxService {
  constructor(private readonly access: AdministrativeCapabilityAccessService, private readonly review: FailedEmailOutboxReviewService, private readonly audit: AuditRecordService) {}

  async list(actorId: string, limit = 50, correlationId?: string): Promise<readonly FailedEmailOutboxMessage[]> {
    await this.access.require(actorId, 'review-failed-email-outbox');
    const messages = await this.review.list(limit);
    await this.audit.append({ actorId, area: 'security', action: 'review-failed-email-outbox', ...(correlationId ? { correlationId } : {}), occurredAt: new Date().toISOString() });
    return messages;
  }

  async requeue(actorId: string, id: string, correlationId?: string): Promise<boolean> {
    await this.access.require(actorId, 'review-failed-email-outbox');
    const requeued = await this.review.requeue(id);
    if (!requeued) return false;
    await this.audit.append({ actorId, area: 'security', action: 'requeue-failed-email', targetId: id, ...(correlationId ? { correlationId } : {}), occurredAt: new Date().toISOString() });
    return true;
  }
}
