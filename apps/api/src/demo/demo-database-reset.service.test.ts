import { describe, expect, it, vi } from 'vitest';
import { DemoDatabaseResetService } from './demo-database-reset.service.js';

describe('DemoDatabaseResetService', () => {
  it('deletes only the fixed fictional demo identities', async () => {
    const deleteMany = vi.fn().mockResolvedValue({ count: 4 });
    const transaction = vi.fn(async (operation) => operation({ account: { deleteMany } }));
    const service = new DemoDatabaseResetService({ $transaction: transaction } as never);

    await service.clear();

    expect(deleteMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: expect.arrayContaining(['00000000-0000-4000-8000-0000000000a1']),
        },
      },
    });
  });
});
