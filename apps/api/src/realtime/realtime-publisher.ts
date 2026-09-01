export type RealtimeEvent = {
  eventId: string;
  eventType: string;
  schemaVersion: 1;
  occurredAt: string;
  resource: { type: string; id: string };
  correlationId?: string;
  payload: Record<string, unknown>;
};

export abstract class RealtimePublisher {
  abstract publishToAccount(accountId: string, event: RealtimeEvent): Promise<void>;
}
