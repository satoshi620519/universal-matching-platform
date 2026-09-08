export type OutboundExtensionEvent = Readonly<{ id: string; type: string; schemaVersion: number; occurredAt: Date; correlationId?: string; payload: Readonly<Record<string, unknown>> }>;

export abstract class OutboundExtensionEventPublisher {
  abstract publish(event: OutboundExtensionEvent): Promise<void>;
}
