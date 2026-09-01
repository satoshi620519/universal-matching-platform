# Immutable configuration reversion

Reversion does not mutate a historical version back into published state.

Instead:
1. select an existing published or superseded historical version,
2. create a new draft derived from that version's immutable values,
3. publish the new draft through the normal transactional publication path.

This preserves append-only history: the historical target remains unchanged and the
reversion itself receives a new version identity and version number.

Reversion requires explicit actor/correlation context and records a distinct audit
event after successful publication.
