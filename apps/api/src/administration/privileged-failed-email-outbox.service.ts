import { Injectable } from '@nestjs/common';

import {
  FailedEmailOutboxReviewService,
} from '../auth/failed-email-outbox-review.service.js';
import type { FailedEmailOutboxMessage } from '../auth/failed-email-outbox.repository.js';
import { AuditRecordService } from './audit-record.service.js';
import { AdministrativeCapabilityAccessService } from './administrative-capability-access.service.js';

@Injectable()
export class PrivilegedFailedEmailOutboxService {
  constructor(
    private readonly access: AdministrativeCapabilityAccessService,
    private readonly review: FailedEmailOutboxReviewService,
    private readonly audit: AuditRecordService,
  ) {}

  async list(actorId: string, limit = 50): Promise<readonly FailedEmailOutboxMessage[]> {
    await this.access.require(actorId, 'review-failed-email-outbox');
    const messages = await this.review.list(limit);
    await this.audit.append({
      actorId,
      area: 'security',
      action: 'review-failed-email-outbox',
      occurredAt: new Date().toISOString(),
    });
    return messages;
  }

  async requeue(actorId: string, id: string): Promise<boolean> {
    await this.access.require(actorId, 'review-failed-email-outbox');
    const requeued = await this.review.requeue(id);
    if (!requeued) return false;
    await this.audit.append({
      actorId,
      area: 'security',
      action: 'requeue-failed-email',
      targetId: id,
      occurredAt: new Date().toISOString(),
    });
    return true;
  }
}
