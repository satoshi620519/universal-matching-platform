import { Injectable } from '@nestjs/common';
import { type OutboundExtensionEvent, OutboundExtensionEventPublisher } from './outbound-extension-event.js';

@Injectable()
export class NoopOutboundExtensionEventPublisher extends OutboundExtensionEventPublisher {
  async publish(_event: OutboundExtensionEvent): Promise<void> {}
}
