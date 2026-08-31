import { Injectable } from '@nestjs/common';

import { SessionRepository } from './session.repository.js';

@Injectable()
export class SessionRevocationService {
  constructor(private readonly sessions: SessionRepository) {}

  async revoke(sessionId: string): Promise<void> {
    await this.sessions.revoke(sessionId, new Date());
  }
}
