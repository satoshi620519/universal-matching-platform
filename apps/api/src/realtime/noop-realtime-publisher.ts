import { Injectable } from '@nestjs/common';
import { RealtimeEvent, RealtimePublisher } from './realtime-publisher.js';

@Injectable()
export class NoopRealtimePublisher extends RealtimePublisher {
  async publishToAccount(_accountId: string, _event: RealtimeEvent): Promise<void> {
    // Durable state is authoritative; transport is intentionally optional.
  }
}
