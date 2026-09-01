# Administrative role management HTTP integration boundary

HTTP integration coverage validates the transport contract independently of the
persistence implementation.

The boundary proves three distinct outcomes:

1. authentication failure returns 401 before any role mutation is invoked;
2. capability denial from the application boundary propagates as 403 and is not
   converted into a successful mutation response;
3. a successful response is emitted only after the authorized application
   mutation resolves.

The tests use the real Nest/Fastify controller and error filter while replacing
the authentication and application boundaries with deterministic collaborators.
Persistence, role evaluation and audit ordering remain separately tested at
their own boundaries, avoiding a brittle test that duplicates every layer's
implementation.
