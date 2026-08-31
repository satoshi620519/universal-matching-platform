import { timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';

import { PasswordHasher } from './password-hasher.js';

const PREFIX = 'scrypt-v1';

@Injectable()
export class NodeScryptPasswordHasher extends PasswordHasher {
  async hash(password: string): Promise<string> {
    // Algorithm parameters and salt generation are intentionally delegated to
    // the runtime implementation boundary; callers only receive an opaque hash.
    const crypto = await import('node:crypto');
    const salt = crypto.randomBytes(16).toString('base64url');
    const derived = await new Promise<Buffer>((resolve, reject) => {
      crypto.scrypt(password, salt, 64, (error, key) => {
        if (error) reject(error);
        else resolve(key);
      });
    });

    return [PREFIX, salt, derived.toString('base64url')].join('$');
  }

  async verify(password: string, passwordHash: string): Promise<boolean> {
    const [prefix, salt, encoded] = passwordHash.split('$');
    if (prefix !== PREFIX || !salt || !encoded) return false;

    const crypto = await import('node:crypto');
    const expected = Buffer.from(encoded, 'base64url');
    const actual = await new Promise<Buffer>((resolve, reject) => {
      crypto.scrypt(password, salt, expected.length, (error, key) => {
        if (error) reject(error);
        else resolve(key);
      });
    });

    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }
}
