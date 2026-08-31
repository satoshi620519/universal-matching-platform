import { Injectable } from '@nestjs/common';
import { canUseCapability, type CapabilityContext } from '@universal-matching/domain';

@Injectable()
export class CapabilityAccessService {
  canUse(context: CapabilityContext): boolean {
    return canUseCapability(context);
  }
}
