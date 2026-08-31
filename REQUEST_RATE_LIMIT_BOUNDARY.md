# Request rate-limit boundary

## Contract

RequestRateLimiter consumes a caller-supplied key and policy and returns:

- allowed;
- remaining;
- retryAfterMs.

Transport code owns key derivation and response mapping. The limiter does not
know about HTTP routes, accounts or authentication semantics.

## Initial adapter

InMemoryRequestRateLimiter is suitable for local development and single-process
test environments only. It is not a distributed production abuse-prevention
solution because buckets are process-local and reset on restart.

A production deployment must replace this adapter with shared durable or
distributed storage while preserving the RequestRateLimiter contract.

## Registration usage

Registration transport should derive a privacy-conscious abuse key and invoke
the limiter before expensive hashing or database writes.
