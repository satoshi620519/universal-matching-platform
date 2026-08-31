export type EmailOutboxMessageStatus = 'pending' | 'delivered';

export interface EmailOutboxMessage {
  readonly id: string;
  readonly accountId: string;
  readonly emailAddress: string;
  readonly kind: 'email-verification';
  readonly status: EmailOutboxMessageStatus;
  readonly attempts: number;
  readonly availableAt: Date;
}

export abstract class EmailOutboxRepository {
  abstract enqueue(input: {
    readonly accountId: string;
    readonly emailAddress: string;
    readonly kind: 'email-verification';
  }): Promise<EmailOutboxMessage>;

  abstract claimNext(now: Date): Promise<EmailOutboxMessage | null>;

  abstract markDelivered(id: string, deliveredAt: Date): Promise<void>;

  abstract reschedule(
    id: string,
    input: { readonly availableAt: Date; readonly error: string },
  ): Promise<void>;
}
