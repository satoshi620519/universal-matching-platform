import { describe, expect, it } from 'vitest';

import { AppModule } from './app.module.js';
import { SafetyEnforcementRepository } from './safety/safety-enforcement.repository.js';
import { PrismaSafetyEnforcementRepository } from './safety/prisma-safety-enforcement.repository.js';

describe('AppModule provider wiring', () => {
  it('binds the safety enforcement abstraction to its Prisma implementation', () => {
    const providers = Reflect.getMetadata('providers', AppModule) as unknown[];

    expect(providers).toContain(PrismaSafetyEnforcementRepository);
    expect(providers).toContainEqual({
      provide: SafetyEnforcementRepository,
      useExisting: PrismaSafetyEnforcementRepository,
    });
  });
});
