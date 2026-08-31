import { Injectable } from '@nestjs/common';
import {
  RequestAuthenticationAdapter,
} from './authentication-adapter.js';
import type { RequestPrincipal } from './request-principal.js';

@Injectable()
export class AnonymousAuthenticationAdapter extends RequestAuthenticationAdapter {
  async authenticate(): Promise<RequestPrincipal | undefined> {
    return undefined;
  }
}
