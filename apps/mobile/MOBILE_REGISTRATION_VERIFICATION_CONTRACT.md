# Mobile Registration and Verification Slice

## Sequence
1. Submit registration details to the existing account registration API.
2. Do not treat registration as a fully authenticated session unless the backend explicitly returns a credential.
3. Present a verification-pending state when verification is required.
4. Refresh account/session state after verification.
5. Keep verification transport provider-neutral (email link, OTP, or backend-hosted flow).

## Security
- Never expose verification secrets in logs.
- Do not persist a password beyond the active submission.
- UI errors must not reveal account-enumeration details.
- Deep-link verification must validate the incoming route before state changes.

## Scope boundary
This slice defines application contracts first. Exact endpoint names and payloads must be read from the existing API implementation before wiring the mobile UI, preventing duplicate or invented backend contracts.
