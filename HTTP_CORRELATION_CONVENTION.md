# HTTP correlation convention

The repository-wide canonical HTTP correlation header is `x-correlation-id`.

This is grounded in the shared observability boundary:

- `CORRELATION_ID_HEADER` defines `x-correlation-id`;
- `configureHttpApplication()` resolves and returns that header for every HTTP request;
- `ApiErrorFilter` resolves the same header for error responses.

Privileged controllers must not introduce a parallel request-id convention. They may
forward the canonical correlation value into application inputs as optional
opaque metadata, but authentication remains free to use its own internal request
label when no canonical correlation value is available.

The shared HTTP boundary is authoritative. Individual controllers should consume
the convention rather than redefining header names.
