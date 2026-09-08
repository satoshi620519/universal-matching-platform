# Mobile Acceptance Checklist

## Prerequisites
- Set EXPO_PUBLIC_API_BASE_URL to a reachable API deployment.
- Run the authoritative backend migrations and start the API.
- Install dependencies from the repository lockfile/package manager used by the purchaser.

## Static verification
From apps/mobile:
- npm run typecheck
- npm run test
- npm run build

## Manual acceptance flow
1. Launch the app and confirm anonymous users are routed to Sign in.
2. Sign in and confirm the secure credential boundary restores the authenticated account.
3. Open Profile and verify categories/field schemas come from the API.
4. Open Discover and verify configured categories and server cursor continuation are used.
5. Pass a profile and verify the decision is recorded once.
6. Like a profile. Only when the server reports mutual=true should a conversation be requested.
7. Confirm the conversation screen receives the server-returned conversation id and loads durable messages.
8. Send a message, reload the conversation, and verify durable history remains authoritative.
9. Verify read acknowledgement and sender-owned soft deletion.
10. Interrupt/reconnect the network while authenticated and verify durable reconciliation rather than trusting missed SSE events.
11. Sign out or end authentication and verify realtime lifecycle cleanup.

## Explicit current API limitation
- No authoritative conversation-list endpoint is currently exposed. Purchasers should not fabricate a client-side list from realtime events or notification payload guesses.
