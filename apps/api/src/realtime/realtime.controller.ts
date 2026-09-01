import { Controller, Get, Headers, MessageEvent, Sse } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { RequestPrincipalResolver } from '../auth/request-principal-resolver.js';
import { SseRealtimePublisher } from './sse-realtime-publisher.js';

@Controller('realtime')
export class RealtimeController {
  constructor(
    private readonly principalResolver: RequestPrincipalResolver,
    private readonly publisher: SseRealtimePublisher,
  ) {}

  @Sse('events')
  events(
    @Headers('authorization') authorization?: string,
    @Headers('x-request-id') requestId?: string,
  ): Observable<MessageEvent> {
    const request = this.principalResolver.requireAuthenticated({ authorization, requestId: requestId ?? 'realtime-events' });
    return new Observable<MessageEvent>((subscriber) => {
      void request.then((principal) => {
        const subscription = this.publisher.streamFor(principal.accountId)
          .pipe(map((event) => ({ id: event.eventId, type: event.eventType, data: event })))
          .subscribe(subscriber);
        return () => subscription.unsubscribe();
      }).catch((error) => subscriber.error(error));
    });
  }
}
