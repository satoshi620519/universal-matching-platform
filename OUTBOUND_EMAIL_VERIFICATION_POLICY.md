# Outbound email and verification-link policy

Registration now triggers verification issuance after a pending password account is
created. The raw verification token flows only through the delivery boundary and
is never included in the registration HTTP response.

Architecture:

PasswordRegistrationService
  -> EmailVerificationDeliveryService
    -> EmailVerificationService.issue()
    -> OutboundEmailSender.send()

Verification links are constructed from a centrally injected
EmailVerificationUrlPolicy. The default policy reads EMAIL_VERIFICATION_BASE_URL
and falls back to localhost for local development.

The default LoggingOutboundEmailSender is intentionally a no-op infrastructure
adapter: it establishes the dependency boundary without claiming production email
delivery. Deployment must replace OutboundEmailSender with a real provider and
configure a trusted HTTPS verification base URL.

Delivery failure currently propagates after registration persistence. This means a
retry strategy must be introduced before production use to avoid a pending account
without a delivered verification message.
