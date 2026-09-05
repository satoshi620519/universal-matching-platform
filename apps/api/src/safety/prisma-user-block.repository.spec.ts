import { ConflictException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { PrismaUserBlockRepository } from './prisma-user-block.repository.js';

describe('PrismaUserBlockRepository', () => {
  it('creates a normalized block and returns the domain value', async () => {
    const database = { $executeRaw: vi.fn().mockResolvedValue(1) };
    const repository = new PrismaUserBlockRepository(database as never);
    const createdAt = new Date('2026-09-05T01:02:03.000Z');

    const result = await repository.create(
      ' 11111111-1111-4111-8111-111111111111 ',
      ' 22222222-2222-4222-8222-222222222222 ',
      createdAt,
    );

    expect(result).toEqual({
      blockerAccountId: '11111111-1111-4111-8111-111111111111',
      blockedAccountId: '22222222-2222-4222-8222-222222222222',
      createdAt: '2026-09-05T01:02:03.000Z',
    });
    expect(database.$executeRaw).toHaveBeenCalledTimes(1);
  });

  it('maps a duplicate insert to ConflictException', async () => {
    const database = { $executeRaw: vi.fn().mockResolvedValue(0) };
    const repository = new PrismaUserBlockRepository(database as never);

    await expect(
      repository.create(
        '11111111-1111-4111-8111-111111111111',
        '22222222-2222-4222-8222-222222222222',
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('reports whether a directed block was removed', async () => {
    const database = { $executeRaw: vi.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(0) };
    const repository = new PrismaUserBlockRepository(database as never);

    await expect(repository.remove('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222')).resolves.toBe(true);
    await expect(repository.remove('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222')).resolves.toBe(false);
    expect(database.$executeRaw).toHaveBeenCalledTimes(2);
  });

  it('reports directed block existence from the query result', async () => {
    const database = { $queryRaw: vi.fn().mockResolvedValueOnce([{ exists: true }]).mockResolvedValueOnce([{ exists: false }]) };
    const repository = new PrismaUserBlockRepository(database as never);

    await expect(repository.exists('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222')).resolves.toBe(true);
    await expect(repository.exists('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222')).resolves.toBe(false);
    expect(database.$queryRaw).toHaveBeenCalledTimes(2);
  });
});
