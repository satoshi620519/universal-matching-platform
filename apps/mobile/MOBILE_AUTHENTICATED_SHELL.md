# Mobile Authenticated Shell

The authenticated shell establishes the product navigation structure without inventing backend feature APIs.

## Included destinations
- home
- discovery
- matches
- conversations
- profile
- settings
- safety

Each destination is selectable from the authenticated shell. Feature screens remain contract-gated: placeholder presentation may exist, but network integration must wait for confirmed backend DTOs/endpoints.

## Sign-out boundary
Sign-out is owned by the application layer. The shell receives an async callback and never manipulates credential storage directly.

## Next integration
Connect the shell to MobileAppShell authenticated state, then replace placeholder destinations one vertical slice at a time after repository API inspection.
