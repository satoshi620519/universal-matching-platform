export interface EmailVerificationLinkPolicy {
  readonly baseUrl: string;
}

export function buildEmailVerificationLink(
  policy: EmailVerificationLinkPolicy,
  token: string,
): string {
  const url = new URL('/auth/email-verification', policy.baseUrl);
  url.searchParams.set('token', token);
  return url.toString();
}
