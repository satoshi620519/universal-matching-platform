# Outbound email identity and observability contract

Every OutboundEmail now carries a stable application-owned messageId. For outbox
delivery this is the durable EmailOutboxMessage.id and remains unchanged across
retries. A future provider adapter should map this identifier to the provider's
idempotency/message metadata where supported.

The identity is intentionally not derived from a verification token and the
outbox still stores no raw verification credential.

Delivery failures cross a narrow classification boundary:

- transient: provider/server failures and rate limiting;
- permanent: ordinary provider 4xx recipient/request failures;
- unknown: errors without grounded provider status semantics.

The current dispatcher records only the classification plus a bounded message
through the existing repository error boundary. It does not persist stack traces,
provider response bodies, authorization headers or credentials.

This slice establishes correlation and observability vocabulary. It does not yet
claim provider-specific idempotency because no provider has been selected.
