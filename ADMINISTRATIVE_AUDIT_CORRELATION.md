# Administrative audit correlation

Privileged HTTP transports may pass a single opaque correlation ID into their
application boundary. Application and mutation services treat it as optional
metadata and audit persistence remains independent of HTTP.

Allowed propagation:

request correlation ID -> privileged application input -> successful audit record

Explicitly excluded:

- request bodies;
- authorization headers and credentials;
- email contents or provider payloads;
- arbitrary HTTP headers.

Operator and deployment commands do not synthesize correlation IDs. When no
correlation is supplied, the audit record is appended without that metadata.

Correlation is attached only after successful privileged operations reach their
existing audit point; authorization failures and no-op mutations do not create a
new audit record merely for correlation.
