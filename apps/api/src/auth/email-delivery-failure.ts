export type EmailDeliveryFailureKind =
  | 'transient'
  | 'permanent'
  | 'unknown';

export interface EmailDeliveryFailure {
  readonly kind: EmailDeliveryFailureKind;
  readonly message: string;
}

export function classifyEmailDeliveryFailure(error: unknown): EmailDeliveryFailure {
  if (error instanceof Error) {
    const status = (error as Error & { status?: unknown }).status;
    if (typeof status === 'number') {
      if (status >= 400 && status < 500 && status !== 429) {
        return { kind: 'permanent', message: error.message };
      }
      if (status === 429 || status >= 500) {
        return { kind: 'transient', message: error.message };
      }
    }
    return { kind: 'unknown', message: error.message };
  }

  return { kind: 'unknown', message: 'email delivery failed' };
}
