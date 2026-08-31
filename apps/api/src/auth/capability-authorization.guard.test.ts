import { describe, expect, it } from 'vitest';
import { CapabilityAuthorizationGuard } from './capability-authorization.guard.js';
import { CapabilityAccessService } from '../capabilities/capability-access.service.js';

describe('capability authorization guard', () => {
  it('allows an authenticated request meeting capability requirements', () => {
    const guard = new CapabilityAuthorizationGuard(
      new CapabilityAccessService(),
      { requiredVerificationLevel: 1 },
    );

    expect(
      guard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({
            principal: { verificationLevel: '1' },
          }),
        }),
      } as never),
    ).toBe(true);
  });

  it('rejects a request without an authenticated principal with 401', () => {
    const guard = new CapabilityAuthorizationGuard(new CapabilityAccessService());

    expect(() =>
      guard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({}),
        }),
      } as never),
    ).toThrow(expect.objectContaining({ status: 401 }));
  });

  it('rejects an authenticated request with an invalid verification level with 401', () => {
    const guard = new CapabilityAuthorizationGuard(new CapabilityAccessService());

    expect(() =>
      guard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({
            principal: { verificationLevel: 'invalid' },
          }),
        }),
      } as never),
    ).toThrow(expect.objectContaining({ status: 401 }));
  });

  it('rejects an authenticated request lacking capability requirements with 403', () => {
    const guard = new CapabilityAuthorizationGuard(
      new CapabilityAccessService(),
      { requiredVerificationLevel: 2 },
    );

    expect(() =>
      guard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({
            principal: { verificationLevel: '1' },
          }),
        }),
      } as never),
    ).toThrow(expect.objectContaining({ status: 403 }));
  });
});
