# Administrative failed-email outbox HTTP transport

The transport layer follows the repository's existing authenticated-controller
convention:

1. read Authorization and request correlation headers;
2. resolve an authenticated request principal;
3. pass only principal.accountId and validated transport input to the
   privileged application boundary.

Routes:

- GET /administration/failed-email-outbox?limit=1..100
- POST /administration/failed-email-outbox/:id/requeue

The controller does not query repositories, evaluate administrative roles or
write audit records. Those responsibilities remain inside the composed
application boundary.

Authentication failure occurs before privileged access. Capability denial is
performed by the application boundary. The list limit is validated before
outbox access, and response handling does not log or duplicate sensitive email
content.
