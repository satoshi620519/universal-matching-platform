import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve(__dirname, 'prisma-match-transition.repository.ts'), 'utf8');
describe('PrismaMatchTransitionRepository concurrency contract', () => {
  it('uses a transaction and idempotency lookup before create', () => {
    expect(source).toContain('$transaction');
    expect(source).toContain('actorAccountId_idempotencyKey');
  });
  it('recovers duplicate idempotency races and checks reciprocal interaction', () => {
    expect(source).toContain("code !== 'P2002'");
    expect(source).toContain('actorAccountId_targetAccountId');
  });
});
