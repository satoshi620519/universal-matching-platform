export interface FailedEmailOutboxMessage {
  readonly id: string;
  readonly accountId: string;
  readonly emailAddress: string;
  readonly kind: 'email-verification';
  readonly attempts: number;
  readonly failedAt: Date;
  readonly lastError: string | null;
}

export abstract class FailedEmailOutboxRepository {
  abstract listFailed(input: {
    readonly limit: number;
    readonly before?: Date;
  }): Promise<readonly FailedEmailOutboxMessage[]>;

  abstract requeueFailed(
    id: string,
    input: { readonly availableAt: Date },
  ): Promise<boolean>;
}
