import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service.js';
import {
  SessionRepository,
  type AuthenticationSession,
} from './session.repository.js';

@Injectable()
export class PrismaSessionRepository extends SessionRepository {
  constructor(private readonly database: DatabaseService) {
    super();
  }

  async create(input: {
    readonly accountId: string;
    readonly authenticationMethod: string;
    readonly expiresAt: Date;
  }): Promise<AuthenticationSession> {
    return this.database.authenticationSession.create({ data: input });
  }
}
