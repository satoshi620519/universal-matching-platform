import { describe, expect, it, vi } from 'vitest';
import { DiscoveryService } from './discovery.service.js';

const scope = { kind: 'country', countryCode: 'JP' } as const;
const policy = { name: 'public', phone: 'owner' } as const;

describe('DiscoveryService', () => {
  it('filters ineligible candidates before privacy projection', async () => {
    const discover = vi.fn().mockResolvedValue({
      items: [
        { id: 'self', accountId: 'a1', categoryId: 'dating', fields: { name: 'Self', phone: 'x' }, geographicScope: scope },
        { id: 'wrong-category', accountId: 'a2', categoryId: 'friends', fields: { name: 'Friend' }, geographicScope: scope },
        { id: 'wrong-country', accountId: 'a3', categoryId: 'dating', fields: { name: 'US' }, geographicScope: { kind: 'country', countryCode: 'US' } },
        { id: 'ok', accountId: 'a4', categoryId: 'dating', fields: { name: 'Visible', phone: 'hidden' }, geographicScope: scope },
      ],
      nextCursor: 'next',
    });
    const service = new DiscoveryService({ discover }, { excludes: vi.fn().mockResolvedValue(false) }, { excludes: vi.fn().mockResolvedValue(false) });
    const result = await service.discover({
      subjectAccountId: 'a1', categoryId: 'dating', geographicScope: scope,
      limit: 20, projectionPolicy: policy,
    });
    expect(result.items).toEqual([{
      id: 'ok', categoryId: 'dating', fields: { name: 'Visible' }, geographicScope: scope,
    }]);
    expect(result.nextCursor).toBe('next');
  });

  it('passes a validated query to the repository', async () => {
    const discover = vi.fn().mockResolvedValue({ items: [] });
    const service = new DiscoveryService({ discover }, { excludes: vi.fn().mockResolvedValue(false) }, { excludes: vi.fn().mockResolvedValue(false) });
    await service.discover({ subjectAccountId: 'a1', categoryId: 'dating', geographicScope: scope, limit: 10, projectionPolicy: policy });
    expect(discover).toHaveBeenCalledWith(expect.objectContaining({ limit: 10, categoryId: 'dating' }));
  });

  it('applies explicit block and safety exclusions before projection', async () => {
    const discover = vi.fn().mockResolvedValue({ items: [{ id: 'p2', accountId: 'a2', categoryId: 'dating', fields: { name: 'Hidden' }, geographicScope: scope }] });
    const block = { excludes: vi.fn().mockResolvedValue(true) };
    const safety = { excludes: vi.fn().mockResolvedValue(false) };
    const service = new DiscoveryService({ discover }, block, safety);
    const result = await service.discover({ subjectAccountId: 'a1', categoryId: 'dating', geographicScope: scope, limit: 10, projectionPolicy: policy });
    expect(result.items).toEqual([]);
    expect(safety.excludes).not.toHaveBeenCalled();
  });

  it('observes a newly applied safety restriction on the next discovery immediately', async () => {
    const discover = vi.fn().mockResolvedValue({
      items: [{ id: 'p2', accountId: 'a2', categoryId: 'dating', fields: { name: 'Visible' }, geographicScope: scope }],
    });
    let restriction: 'none' | 'feature-restricted' = 'none';
    const effectiveSafety = { resolveForAccount: vi.fn(async () => restriction) };
    const service = new DiscoveryService(
      { discover },
      { excludes: vi.fn().mockResolvedValue(false) },
      { excludes: vi.fn().mockResolvedValue(false) },
      effectiveSafety as never,
    );

    const before = await service.discover({ subjectAccountId: 'a1', categoryId: 'dating', geographicScope: scope, limit: 10, projectionPolicy: policy });
    expect(before.items).toHaveLength(1);

    restriction = 'feature-restricted';
    const after = await service.discover({ subjectAccountId: 'a1', categoryId: 'dating', geographicScope: scope, limit: 10, projectionPolicy: policy });
    expect(after.items).toEqual([]);
    expect(effectiveSafety.resolveForAccount).toHaveBeenCalledWith('a1', 'general');
  });
});
