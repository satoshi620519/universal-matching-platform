import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { RealtimeEvent, RealtimePublisher } from './realtime-publisher.js';

@Injectable()
export class SseRealtimePublisher extends RealtimePublisher {
  private readonly streams = new Map<string, Subject<RealtimeEvent>>();

  publishToAccount(accountId: string, event: RealtimeEvent): Promise<void> {
    this.streamFor(accountId).next(event);
    return Promise.resolve();
  }

  streamFor(accountId: string): Observable<RealtimeEvent> {
    return this.streamFor(accountId).asObservable();
  }

  private streamFor(accountId: string): Subject<RealtimeEvent> {
    let stream = this.streams.get(accountId);
    if (!stream) {
      stream = new Subject<RealtimeEvent>();
      this.streams.set(accountId, stream);
    }
    return stream;
  }
}
