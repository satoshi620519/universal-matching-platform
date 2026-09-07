import { describe, expect, it } from 'vitest';

import {
  ADMIN_SESSION_COOKIE_NAME,
  readAdminSessionCookie,
  serializeAdminSessionCookie,
  serializeClearedAdminSessionCookie,
} from './session-cookie.js';

describe('session cookie transport', () => {
  it('serializes an HttpOnly secure seven-day admin session cookie', () => {
    const cookie = serializeAdminSessionCookie('raw credential;value');

    expect(cookie).toBe(
      `${ADMIN_SESSION_COOKIE_NAME}=raw%20credential%3Bvalue; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`,
    );
  });

  it('serializes a cleared session cookie with the same scope and security flags', () => {
    expect(serializeClearedAdminSessionCookie()).toBe(
      `${ADMIN_SESSION_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    );
  });

  it('reads the session credential from a cookie header', () => {
    expect(
      readAdminSessionCookie(
        'other=value; universal_admin_session=raw%20credential%3Bvalue; another=value',
      ),
    ).toBe('raw credential;value');
  });

  it('returns undefined for missing, empty, or malformed cookie values', () => {
    expect(readAdminSessionCookie(undefined)).toBeUndefined();
    expect(readAdminSessionCookie('universal_admin_session=')).toBeUndefined();
    expect(readAdminSessionCookie('universal_admin_session=%E0%A4%A')).toBeUndefined();
  });
});
