import { Injectable } from '@nestjs/common';
import { evaluateAbuseControl, type AbuseControlDecision, type AbuseControlPolicy } from '@universal/domain';
import { AbuseControlRepository } from './abuse-control.repository.js';

@Injectable()
export class AbuseControlService {
  constructor(private readonly repository: AbuseControlRepository) {}

  async consume(input: { subject: string; policy: AbuseControlPolicy; now?: number }): Promise<AbuseControlDecision> {
    const now = input.now ?? Date.now();
    const key = `${input.policy.key}:${input.subject.trim()}`;
    const current = await this.repository.get(key);
    const window = !current || now - current.startedAt >= input.policy.windowMs
      ? { count: 0, startedAt: now }
      : current;
    const decision = evaluateAbuseControl({ policy: input.policy, count: window.count, windowStartedAt: window.startedAt, now });
    if (decision.allowed) await this.repository.put(key, { count: window.count + 1, startedAt: window.startedAt });
    return decision;
  }
}
