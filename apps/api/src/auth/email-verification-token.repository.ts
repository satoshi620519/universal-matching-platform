export interface EmailVerificationTokenRecord {
  readonly id: string;
  readonly accountId: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
  readonly consumedAt: Date | null;
}

export abstract class EmailVerificationTokenRepository {
  abstract create(input: {
    readonly accountId: string;
    readonly tokenHash: string;
    readonly expiresAt: Date;
  }): Promise<EmailVerificationTokenRecord>;

  abstract consumeIfUsable(
    tokenHash: string,
    consumedAt: Date,
  ): Promise<EmailVerificationTokenRecord | null>;
}
