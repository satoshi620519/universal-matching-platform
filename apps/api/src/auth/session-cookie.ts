export const ADMIN_SESSION_COOKIE_NAME = 'universal_admin_session';

export function serializeAdminSessionCookie(credential: string): string {
  return `${ADMIN_SESSION_COOKIE_NAME}=${encodeURIComponent(credential)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`;
}

export function serializeClearedAdminSessionCookie(): string {
  return `${ADMIN_SESSION_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function readAdminSessionCookie(cookieHeader: string | undefined): string | undefined {
  if (!cookieHeader) return undefined;

  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    const name = part.slice(0, separator).trim();
    if (name !== ADMIN_SESSION_COOKIE_NAME) continue;
    const value = part.slice(separator + 1).trim();
    if (!value) return undefined;
    try {
      return decodeURIComponent(value);
    } catch {
      return undefined;
    }
  }

  return undefined;
}
