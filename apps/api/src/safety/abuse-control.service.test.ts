import { describe, expect, it } from 'vitest';
import { createAbuseControlPolicy } from '@universal/domain';
import { AbuseControlRepository, type AbuseControlWindow } from './abuse-control.repository.js';
import { AbuseControlService } from './abuse-control.service.js';

class MemoryAbuseControlRepository extends AbuseControlRepository {
  readonly values = new Map<string, AbuseControlWindow>();
  async get(key: string) { return this.values.get(key) ?? null; }
  async put(key: string, value: AbuseControlWindow) { this.values.set(key, value); }
}

describe('AbuseControlService', () => {
  it('counts per policy and subject, rejecting without incrementing after the limit', async () => {
    const repository = new MemoryAbuseControlRepository();
    const service = new AbuseControlService(repository);
    const policy = createAbuseControlPolicy({ key: 'report', limit: 2, windowMs: 1000 });
    expect((await service.consume({ subject: 'account-a', policy, now: 0 })).allowed).toBe(true);
    expect((await service.consume({ subject: 'account-a', policy, now: 100 })).allowed).toBe(true);
    const rejected = await service.consume({ subject: 'account-a', policy, now: 200 });
    expect(rejected.allowed).toBe(false);
    expect(repository.values.get('report:account-a')?.count).toBe(2);
  });

  it('isolates subjects and resets expired windows', async () => {
    const repository = new MemoryAbuseControlRepository();
    const service = new AbuseControlService(repository);
    const policy = createAbuseControlPolicy({ key: 'report', limit: 1, windowMs: 1000 });
    await service.consume({ subject: 'account-a', policy, now: 0 });
    expect((await service.consume({ subject: 'account-b', policy, now: 100 })).allowed).toBe(true);
    expect((await service.consume({ subject: 'account-a', policy, now: 1000 })).allowed).toBe(true);
  });
});
