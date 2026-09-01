# Email outbox terminal failure policy

Email delivery failures are classified before retry decisions.

- transient failures continue through bounded exponential backoff;
- permanent failures transition immediately to the terminal `failed` state;
- unknown failures retain the existing bounded retry path because provider semantics
  are insufficient to prove the failure is permanent.

A terminal message records `failedAt`, clears its worker lock and preserves a
bounded, classification-prefixed error. Claim queries only select `pending`
messages, so terminal failures are not retried automatically.

The terminal state is intentionally distinct from `delivered`. It creates an
operational review boundary without silently dropping delivery evidence.

This is not yet a provider-specific dead-letter queue. No external queue was
invented, and no raw verification token is persisted in the outbox.
