import { Injectable } from '@nestjs/common';

import { SessionRepository, type AuthenticationSession } from './session.repository.js';

export interface IssueSessionInput {
  readonly accountId: string;
  readonly authenticationMethod: string;
}

@Injectable()
export class SessionIssuanceService {
  private static readonly SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

  constructor(private readonly sessions: SessionRepository) {}

  async issue(input: IssueSessionInput): Promise<AuthenticationSession> {
    return this.sessions.create({
      accountId: input.accountId,
      authenticationMethod: input.authenticationMethod,
      expiresAt: new Date(Date.now() + SessionIssuanceService.SESSION_TTL_MS),
    });
  }
}
