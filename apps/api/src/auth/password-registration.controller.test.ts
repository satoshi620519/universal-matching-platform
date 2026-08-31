import { describe, expect, it, vi } from 'vitest';

import { PasswordRegistrationController } from './password-registration.controller.js';

describe('PasswordRegistrationController', () => {
  it('passes string input and a derived remote-address key to transport service', async () => {
    const register = vi.fn().mockResolvedValue(undefined);
    const controller = new PasswordRegistrationController({ register } as any);

    await controller.register(
      { email: 'user@example.test', password: '123456789012' },
      { ip: '203.0.113.7' } as any,
    );

    expect(register).toHaveBeenCalledWith(expect.objectContaining({
      email: 'user@example.test',
      password: '123456789012',
      rateLimitKey: expect.stringMatching(/^registration:/),
    }));
    expect(register.mock.calls[0][0].rateLimitKey).not.toContain('203.0.113.7');
  });

  it('converts non-string fields to invalid transport input', async () => {
    const register = vi.fn().mockResolvedValue(undefined);
    const controller = new PasswordRegistrationController({ register } as any);

    await controller.register(
      { email: 123, password: null },
      { ip: '203.0.113.7' } as any,
    );

    expect(register).toHaveBeenCalledWith(expect.objectContaining({
      email: '',
      password: '',
    }));
  });
});
