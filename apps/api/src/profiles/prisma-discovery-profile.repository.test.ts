import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve(__dirname, 'prisma-discovery-profile.repository.ts'), 'utf8');

describe('PrismaDiscoveryProfileRepository query contract', () => {
  it('uses deterministic id ordering and limit-plus-one pagination', () => {
    expect(source).toContain("orderBy: { id: 'asc' }");
    expect(source).toContain('take: query.limit + 1');
    expect(source).toContain('skip: 1');
  });

  it('keeps cursor opaque and rejects malformed values', () => {
    expect(source).toContain("toString('base64url')");
    expect(source).toContain("throw new Error('Discovery cursor is invalid')");
  });
});
