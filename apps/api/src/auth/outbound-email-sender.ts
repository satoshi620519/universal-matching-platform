export interface OutboundEmail {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
}

export abstract class OutboundEmailSender {
  abstract send(message: OutboundEmail): Promise<void>;
}
