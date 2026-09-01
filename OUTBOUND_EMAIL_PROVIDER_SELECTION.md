# Outbound email provider selection boundary

## Current repository evidence

The application owns a provider-neutral `OutboundEmailSender` contract and
currently binds it to `LoggingOutboundEmailSender`, which deliberately performs
no external network delivery.

No email provider SDK, provider credential environment variables, deployment
secret convention or selected messaging vendor is currently committed. The
architecture explicitly keeps email/SMS/push providers replaceable.

Therefore selecting and enabling a real provider is an explicit deployment
decision, not a safe inference from the presence of an outbox.

## Selection requirements

A provider adapter must be evaluated against:

1. provider support for stable application message correlation or idempotency;
2. transient versus permanent error semantics and rate-limit behavior;
3. regional availability appropriate for global deployments;
4. credential rotation and secret injection outside source control;
5. sender/domain verification requirements;
6. delivery-status webhook authenticity and replay handling;
7. operational observability without storing sensitive payloads unnecessarily;
8. cost and deployment portability suitable for a commercial template product.

## Integration sequence

1. Record the selected provider and deployment assumptions explicitly.
2. Add typed runtime configuration that fails closed when delivery is enabled but
   required credentials are absent.
3. Implement one provider adapter behind `OutboundEmailSender`.
4. Map the durable application `messageId` to provider correlation metadata
   where supported.
5. Preserve existing failure classification and terminal-failure behavior.
6. Add provider adapter contract tests using fake HTTP/SDK boundaries.
7. Enable the adapter only through explicit dependency configuration; local and
   test environments must not silently send real email.

Until these conditions are met, `LoggingOutboundEmailSender` remains the safe
default and the transactional outbox can be exercised without accidental
external delivery.
