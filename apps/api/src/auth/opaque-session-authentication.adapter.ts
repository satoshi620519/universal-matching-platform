import { Injectable } from '@nestjs/common';

import { RequestAuthenticationAdapter } from './authentication-adapter.js';
import { hashSessionCredential } from './session-credential.js';
import { SessionRepository } from './session.repository.js';
import type { RequestPrincipal } from './request-principal.js';

@Injectable()
export class OpaqueSessionAuthenticationAdapter extends RequestAuthenticationAdapter {
  constructor(private readonly sessions: SessionRepository) {
    super();
  }

  async authenticate(input: {
    readonly authorization?: string;
    readonly requestId: string;
  }): Promise<RequestPrincipal | undefined> {
    const credential = parseBearerCredential(input.authorization);
    if (!credential) {
      return undefined;
    }

    const session = await this.sessions.findByCredentialHash(
      hashSessionCredential(credential),
    );

    if (
      !session ||
      session.revokedAt !== null ||
      session.expiresAt.getTime() <= Date.now()
    ) {
      return undefined;
    }

    return {
      accountId: session.accountId,
      authenticationMethod: session.authenticationMethod,
      sessionId: session.id,
    };
  }
}

function parseBearerCredential(value: string | undefined): string | undefined {
  if (!value?.startsWith('Bearer ')) {
    return undefined;
  }

  const credential = value.slice('Bearer '.length).trim();
  return credential.length > 0 ? credential : undefined;
}
