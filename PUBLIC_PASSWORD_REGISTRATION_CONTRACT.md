# Public password registration contract

## Endpoint

POST /auth/register

Request body:

```json
{ "email": "user@example.test", "password": "..." }
```

## Response

The endpoint returns 202 Accepted with no account identifier.

A duplicate authentication identity is intentionally mapped to the same transport
outcome as a newly accepted registration request.

Invalid input returns the existing generic HTTP error envelope through the
global error filter.

Rate-limited requests are rejected before validation, hashing or persistence.

## Rate-limit key

The controller derives a key from Fastify's resolved request.ip and hashes that
value before passing it to the limiter. It does not parse arbitrary forwarded
headers directly; proxy trust remains an application deployment configuration
boundary.

## Initial production limitation

The current limiter adapter is process-local. Multi-instance production
deployment must replace it with a shared limiter adapter before relying on this
endpoint for distributed abuse prevention.
