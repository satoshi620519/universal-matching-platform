import { describe, expect, it } from 'vitest';

import { NodeScryptPasswordHasher } from './node-scrypt-password-hasher.js';

describe('NodeScryptPasswordHasher', () => {
  const hasher = new NodeScryptPasswordHasher();

  it('hashes and verifies the original password', async () => {
    const hash = await hasher.hash('correct horse battery staple');

    expect(hash).not.toContain('correct horse battery staple');
    await expect(
      hasher.verify('correct horse battery staple', hash),
    ).resolves.toBe(true);
  });

  it('rejects a different password', async () => {
    const hash = await hasher.hash('correct horse battery staple');

    await expect(hasher.verify('wrong password', hash)).resolves.toBe(false);
  });

  it('rejects malformed or unsupported hashes without throwing', async () => {
    await expect(hasher.verify('anything', 'bad-format')).resolves.toBe(false);
    await expect(hasher.verify('anything', 'argon2-v1$salt$hash')).resolves.toBe(false);
  });

  it('uses distinct salts for repeated hashes', async () => {
    const first = await hasher.hash('same password');
    const second = await hasher.hash('same password');

    expect(first).not.toBe(second);
    await expect(hasher.verify('same password', first)).resolves.toBe(true);
    await expect(hasher.verify('same password', second)).resolves.toBe(true);
  });
});
