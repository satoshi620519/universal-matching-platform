import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { RealtimeEvent, RealtimePublisher } from './realtime-publisher.js';

@Injectable()
export class SseRealtimePublisher extends RealtimePublisher {
  private readonly streams = new Map<string, Subject<RealtimeEvent>>();

  publishToAccount(accountId: string, event: RealtimeEvent): Promise<void> {
    this.streams.get(accountId)?.next(event);
    return Promise.resolve();
  }

  streamFor(accountId: string): Observable<RealtimeEvent> {
    return new Observable<RealtimeEvent>((subscriber) => {
      const stream = this.getOrCreateStream(accountId);
      const subscription = stream.subscribe(subscriber);
      return () => {
        subscription.unsubscribe();
        if (stream.observers.length === 0 && this.streams.get(accountId) === stream) {
          this.streams.delete(accountId);
        }
      };
    });
  }

  private getOrCreateStream(accountId: string): Subject<RealtimeEvent> {
    let stream = this.streams.get(accountId);
    if (!stream) {
      stream = new Subject<RealtimeEvent>();
      this.streams.set(accountId, stream);
    }
    return stream;
  }
}
