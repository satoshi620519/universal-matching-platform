export interface RequestPrincipal {
  readonly accountId: string;
  readonly authenticationMethod: string;
  readonly sessionId?: string;
  readonly deviceId?: string;
  readonly verificationLevel?: string;
}

export function isAuthenticatedPrincipal(
  value: RequestPrincipal | undefined,
): value is RequestPrincipal {
  return Boolean(value?.accountId && value.authenticationMethod);
}
