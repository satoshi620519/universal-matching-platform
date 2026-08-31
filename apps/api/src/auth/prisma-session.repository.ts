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
    readonly credentialHash: string;
  }): Promise<AuthenticationSession> {
    return this.database.authenticationSession.create({ data: input });
  }

  async findByCredentialHash(
    credentialHash: string,
  ): Promise<AuthenticationSession | null> {
    return this.database.authenticationSession.findUnique({
      where: { credentialHash },
    });
  }

  async revoke(id: string, revokedAt: Date): Promise<void> {
    await this.database.authenticationSession.updateMany({
      where: { id, revokedAt: null },
      data: { revokedAt },
    });
  }
}
