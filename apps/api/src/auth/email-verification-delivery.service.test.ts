import { describe, expect, it, vi } from 'vitest';

import { EmailVerificationDeliveryService } from './email-verification-delivery.service.js';

describe('EmailVerificationDeliveryService', () => {
  it('issues a token and delivers a trusted verification link', async () => {
    const issue = vi.fn().mockResolvedValue('opaque-token');
    const send = vi.fn().mockResolvedValue(undefined);
    const service = new EmailVerificationDeliveryService(
      { issue } as any,
      { send } as any,
      { baseUrl: () => 'https://app.example.test' } as any,
    );

    await service.issueAndDeliver({
      accountId: 'account-1',
      emailAddress: 'user@example.test',
      messageId: 'outbox-1',
    });

    expect(issue).toHaveBeenCalledWith('account-1');
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      messageId: 'outbox-1',
      to: 'user@example.test',
      text: expect.stringContaining('https://app.example.test/auth/email-verification?token=opaque-token'),
    }));
  });
});
