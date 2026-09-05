import { describe, expect, it, vi } from 'vitest';
import { UserBlockDiscoveryExclusionPolicy } from './user-block-discovery-exclusion.policy.js';
import { UserBlockRepository } from '../safety/user-block.repository.js';

describe('UserBlockDiscoveryExclusionPolicy', () => {
  it('excludes candidates when the subject has blocked them', async () => {
    const blocks = {
      exists: vi.fn().mockResolvedValue(true),
    } as unknown as UserBlockRepository;

    await expect(new UserBlockDiscoveryExclusionPolicy(blocks).excludes('subject', 'candidate')).resolves.toBe(true);
    expect(blocks.exists).toHaveBeenCalledWith('subject', 'candidate');
    expect(blocks.exists).toHaveBeenCalledTimes(1);
  });

  it('excludes candidates when the candidate has blocked the subject', async () => {
    const blocks = {
      exists: vi.fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true),
    } as unknown as UserBlockRepository;

    await expect(new UserBlockDiscoveryExclusionPolicy(blocks).excludes('subject', 'candidate')).resolves.toBe(true);
    expect(blocks.exists).toHaveBeenNthCalledWith(1, 'subject', 'candidate');
    expect(blocks.exists).toHaveBeenNthCalledWith(2, 'candidate', 'subject');
  });

  it('allows candidates when neither side has blocked the other', async () => {
    const blocks = {
      exists: vi.fn().mockResolvedValue(false),
    } as unknown as UserBlockRepository;

    await expect(new UserBlockDiscoveryExclusionPolicy(blocks).excludes('subject', 'candidate')).resolves.toBe(false);
    expect(blocks.exists).toHaveBeenCalledTimes(2);
  });
});
