import { describe, expect, it, vi } from 'vitest';

import { PostgresMigrationExecutor } from '@universal/database';

import { createMigrationExecutor } from './migration-executor.provider.js';

describe('createMigrationExecutor', () => {
  it('composes the Prisma database service into the PostgreSQL migration executor', () => {
    const database = {
      $queryRawUnsafe: vi.fn(),
      $executeRawUnsafe: vi.fn(),
      $transaction: vi.fn(),
    };

    const executor = createMigrationExecutor(database as any);

    expect(executor).toBeInstanceOf(PostgresMigrationExecutor);
  });
});
