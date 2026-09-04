import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve(__dirname, 'prisma-discovery-profile.repository.ts'), 'utf8');

describe('PrismaDiscoveryProfileRepository query contract', () => {
  it('uses deterministic id ordering and limit-plus-one pagination', () => {
    expect(source).toContain("? { id: query.sort.direction }");
    expect(source).toContain(": { id: 'asc' }");
    expect(source).toContain('take: query.limit + 1');
    expect(source).toContain('skip: 1');
  });

  it('keeps cursor opaque and rejects malformed values', () => {
    expect(source).toContain("toString('base64url')");
    expect(source).toContain("throw new Error('Discovery cursor is invalid')");
  });

  it('pushes subject exclusion and hierarchical geographic filtering into persistence', () => {
    expect(source).toContain('accountId: { not: query.subjectAccountId }');
    expect(source).toContain("scopeKind: 'global'");
    expect(source).toContain("scopeKind: 'country'");
    expect(source).toContain("scopeKind: 'region'");
    expect(source).toContain("scopeKind: 'city'");
    expect(source).toContain('localityCode: scope.localityCode');
  });

  it('loads private coordinates only for distance filtering and never projects them', () => {
    expect(source).toContain('privateLatitude: true, privateLongitude: true');
    expect(source).toContain('createPrivateLocation');
    expect(source).toContain('isWithinDistance');
    expect(source).toContain('candidate.privateLocation');
  });

  it('continues persistence pages until enough distance-eligible candidates are collected', () => {
    expect(source).toContain('while (eligible.length <= query.limit && hasMore)');
    expect(source).toContain('eligible.length === query.limit + 1');
    expect(source).toContain("nextCursor: encodeCursor({ id: last.id })");
  });

  it('excludes candidates without private coordinates when distance filtering is enabled', () => {
    expect(source).toContain('if (candidate.privateLocation && isWithinDistance');
    expect(source).toContain('return { items: [] };');
  });
});
