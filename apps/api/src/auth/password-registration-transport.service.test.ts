import { BadRequestException, TooManyRequestsException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { DuplicateAuthenticationIdentityError } from './duplicate-authentication-identity.error.js';
import { PasswordRegistrationTransportService } from './password-registration-transport.service.js';

describe('PasswordRegistrationTransportService', () => {
  function createService(overrides: Record<string, unknown> = {}) {
    const limiter = { consume: vi.fn().mockReturnValue({ allowed: true }) };
    const policy = { validate: vi.fn().mockReturnValue([]) };
    const registration = { register: vi.fn().mockResolvedValue(undefined) };
    return {
      limiter,
      policy,
      registration,
      service: new PasswordRegistrationTransportService(
        limiter as any,
        policy as any,
        registration as any,
      ),
      ...overrides,
    };
  }

  it('rate limits before validation and registration', async () => {
    const limiter = { consume: vi.fn().mockReturnValue({ allowed: false }) };
    const policy = { validate: vi.fn() };
    const registration = { register: vi.fn() };
    const service = new PasswordRegistrationTransportService(
      limiter as any, policy as any, registration as any,
    );

    await expect(service.register({
      email: 'user@example.test', password: '123456789012', rateLimitKey: 'key',
    })).rejects.toBeInstanceOf(TooManyRequestsException);

    expect(policy.validate).not.toHaveBeenCalled();
    expect(registration.register).not.toHaveBeenCalled();
  });

  it('rejects invalid email or password with one generic response class', async () => {
    const { service, registration } = createService();
    await expect(service.register({
      email: 'invalid', password: '123456789012', rateLimitKey: 'key',
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(registration.register).not.toHaveBeenCalled();
  });

  it('normalizes input before application registration', async () => {
    const { service, registration } = createService();
    await service.register({
      email: ' User@Example.TEST ', password: '123456789012', rateLimitKey: 'key',
    });
    expect(registration.register).toHaveBeenCalledWith({
      providerSubject: 'User@example.test',
      password: '123456789012',
    });
  });

  it('makes duplicate identity submission transport-indistinguishable from success', async () => {
    const { service, registration } = createService();
    registration.register.mockRejectedValue(new DuplicateAuthenticationIdentityError());

    await expect(service.register({
      email: 'user@example.test', password: '123456789012', rateLimitKey: 'key',
    })).resolves.toBeUndefined();
  });
});
