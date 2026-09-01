import { Module } from '@nestjs/common';
import { AccountRepository } from './accounts/account.repository.js';
import { AccountLookupController } from './accounts/account-lookup.controller.js';
import { AuthenticatedAccountLookupController } from './accounts/authenticated-account-lookup.controller.js';
import { AuthenticatedAccountContextService } from './accounts/authenticated-account-context.service.js';
import { AuthenticatedAccountActivationService } from './accounts/authenticated-account-activation.service.js';
import { AuthenticatedAccountActivationController } from './accounts/authenticated-account-activation.controller.js';
import { AuthenticatedAccountDeletionRequestController } from './accounts/authenticated-account-deletion-request.controller.js';
import { AuthenticatedAccountDeletionRequestService } from './accounts/authenticated-account-deletion-request.service.js';
import { AccountDeletionRequestService } from './accounts/account-deletion-request.service.js';
import { AuthenticatedCapabilityAccessService } from './capabilities/authenticated-capability-access.service.js';
import { AuthenticatedCapabilityDecisionService } from './capabilities/authenticated-capability-decision.service.js';
import { AccountLookupService } from './accounts/account-lookup.service.js';
import { CapabilityAccessController } from './capabilities/capability-access.controller.js';
import { CapabilityAccessService } from './capabilities/capability-access.service.js';
import { AccountActivationController } from './accounts/account-activation.controller.js';
import { AccountActivationService } from './accounts/account-activation.service.js';
import { PrismaAccountRepository } from './accounts/prisma-account.repository.js';
import { AnonymousAuthenticationAdapter } from './auth/anonymous-authentication.adapter.js';
import { OpaqueSessionAuthenticationAdapter } from './auth/opaque-session-authentication.adapter.js';
import { AuthenticationIdentityRepository } from './auth/authentication-identity.repository.js';
import { AuthenticationIdentityService } from './auth/authentication-identity.service.js';
import { PrismaAuthenticationIdentityRepository } from './auth/prisma-authentication-identity.repository.js';
import { PasswordCredentialRepository } from './auth/password-credential.repository.js';
import { PasswordHasher } from './auth/password-hasher.js';
import { NodeScryptPasswordHasher } from './auth/node-scrypt-password-hasher.js';
import { PrismaPasswordCredentialRepository } from './auth/prisma-password-credential.repository.js';
import { PasswordRegistrationRepository } from './auth/password-registration.repository.js';
import { PrismaPasswordRegistrationRepository } from './auth/prisma-password-registration.repository.js';
import { PasswordRegistrationService } from './auth/password-registration.service.js';
import { PasswordRegistrationTransportService } from './auth/password-registration-transport.service.js';
import { PasswordRegistrationController } from './auth/password-registration.controller.js';
import { PasswordSignInService } from './auth/password-sign-in.service.js';
import { EmailVerificationController } from './auth/email-verification.controller.js';
import { EmailVerificationService } from './auth/email-verification.service.js';
import { EmailVerificationDeliveryService } from './auth/email-verification-delivery.service.js';
import { EmailOutboxRepository } from './auth/email-outbox.repository.js';
import { PrismaEmailOutboxRepository } from './auth/prisma-email-outbox.repository.js';
import { EmailOutboxDispatchService } from './auth/email-outbox-dispatch.service.js';
import { EmailOutboxWorker } from './auth/email-outbox-worker.js';
import { EmailOutboxProcessService } from './auth/email-outbox-process.service.js';
import { FailedEmailOutboxRepository } from './auth/failed-email-outbox.repository.js';
import { PrismaFailedEmailOutboxRepository } from './auth/prisma-failed-email-outbox.repository.js';
import { FailedEmailOutboxReviewService } from './auth/failed-email-outbox-review.service.js';
import { OutboundEmailSender } from './auth/outbound-email-sender.js';
import { LoggingOutboundEmailSender } from './auth/logging-outbound-email-sender.js';
import { EmailVerificationUrlPolicy } from './auth/email-verification-url-policy.js';
import { EnvironmentEmailVerificationUrlPolicy } from './auth/environment-email-verification-url-policy.js';
import { EmailVerificationTokenRepository } from './auth/email-verification-token.repository.js';
import { PrismaEmailVerificationTokenRepository } from './auth/prisma-email-verification-token.repository.js';
import { PasswordSignInTransportService } from './auth/password-sign-in-transport.service.js';
import { PasswordSignInController } from './auth/password-sign-in.controller.js';
import { SessionController } from './auth/session.controller.js';
import { SessionRepository } from './auth/session.repository.js';
import { PrismaSessionRepository } from './auth/prisma-session.repository.js';
import { SessionIssuanceService } from './auth/session-issuance.service.js';
import { SessionRevocationService } from './auth/session-revocation.service.js';
import { MinimumPasswordPolicy, PasswordPolicy } from './auth/password-policy.js';
import { RequestRateLimiter } from './common/rate-limit/request-rate-limiter.js';
import { InMemoryRequestRateLimiter } from './common/rate-limit/in-memory-request-rate-limiter.js';
import { RequestAuthenticationAdapter } from './auth/authentication-adapter.js';
import { RequestPrincipalResolver } from './auth/request-principal-resolver.js';
import { DatabaseModule } from './database/database.module.js';
import { RoleAssignmentRepository } from './administration/role-assignment.repository.js';
import { PrismaRoleAssignmentRepository } from './administration/prisma-role-assignment.repository.js';
import { AdministrativeRoleAccessService } from './administration/administrative-role-access.service.js';
import { AuditRecordRepository } from './administration/audit-record.repository.js';
import { PrismaAuditRecordRepository } from './administration/prisma-audit-record.repository.js';
import { AuditRecordService } from './administration/audit-record.service.js';
import { HealthController } from './health/health.controller.js';
import { VerificationAccessController } from './verification/verification-access.controller.js';
import { VerificationAccessService } from './verification/verification-access.service.js';
import { VerificationRepository } from './verification/verification.repository.js';
import { SafetyEnforcementRepository } from './safety/safety-enforcement.repository.js';
import { PrismaSafetyEnforcementRepository } from './safety/prisma-safety-enforcement.repository.js';
import { EffectiveSafetyRestrictionService } from './safety/effective-safety-restriction.service.js';
import { PrismaVerificationRepository } from './verification/prisma-verification.repository.js';
import { VerificationService } from './verification/verification.service.js';
import { VerificationLevelAccessService } from './verification/verification-level-access.service.js';
import { VerificationCapabilityAccessService } from './verification/verification-capability-access.service.js';
import { HealthStatusService } from './health/health-status.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthController, PasswordRegistrationController, EmailVerificationController, PasswordSignInController, SessionController, AccountActivationController, VerificationAccessController, CapabilityAccessController, AccountLookupController, AuthenticatedAccountLookupController, AuthenticatedAccountActivationController, AuthenticatedAccountDeletionRequestController],
  providers: [AdministrativeRoleAccessService, AuditRecordService, PrismaRoleAssignmentRepository, PrismaAuditRecordRepository, EffectiveSafetyRestrictionService, AuthenticatedCapabilityDecisionService, AuthenticatedCapabilityAccessService, AuthenticatedAccountActivationService, AuthenticatedAccountDeletionRequestService, AuthenticatedAccountContextService, AccountDeletionRequestService,
    HealthStatusService,
    CapabilityAccessService,
    AccountActivationService,
    VerificationAccessService,
    AccountLookupService,
    RequestPrincipalResolver,
    PrismaAccountRepository,
    PrismaAuthenticationIdentityRepository,
    PrismaPasswordCredentialRepository,
    PrismaPasswordRegistrationRepository,
    PasswordRegistrationService,
    PasswordRegistrationTransportService,
    PasswordSignInService,
    EmailVerificationService,
    EmailVerificationDeliveryService,
    EmailOutboxDispatchService,
    EmailOutboxWorker,
    EmailOutboxProcessService,
    FailedEmailOutboxReviewService,
    PrismaEmailOutboxRepository,
    PrismaFailedEmailOutboxRepository,
    LoggingOutboundEmailSender,
    EnvironmentEmailVerificationUrlPolicy,
    PrismaEmailVerificationTokenRepository,
    PasswordSignInTransportService,
    SessionIssuanceService,
    SessionRevocationService,
    PrismaSessionRepository,
    MinimumPasswordPolicy,
    InMemoryRequestRateLimiter,
    NodeScryptPasswordHasher,
    PrismaVerificationRepository,
    PrismaSafetyEnforcementRepository,
    VerificationService,
    VerificationLevelAccessService,
    VerificationCapabilityAccessService,
    AuthenticationIdentityService,
    AnonymousAuthenticationAdapter,
    OpaqueSessionAuthenticationAdapter,
    {
      provide: AuditRecordRepository,
      useExisting: PrismaAuditRecordRepository,
    },
    {
      provide: RoleAssignmentRepository,
      useExisting: PrismaRoleAssignmentRepository,
    },
    {
      provide: AccountRepository,
      useExisting: PrismaAccountRepository,
    },
    {
      provide: SafetyEnforcementRepository,
      useExisting: PrismaSafetyEnforcementRepository,
    },
    {
      provide: VerificationRepository,
      useExisting: PrismaVerificationRepository,
    },
    {
      provide: AuthenticationIdentityRepository,
      useExisting: PrismaAuthenticationIdentityRepository,
    },
    {
      provide: FailedEmailOutboxRepository,
      useExisting: PrismaFailedEmailOutboxRepository,
    },
    {
      provide: EmailOutboxRepository,
      useExisting: PrismaEmailOutboxRepository,
    },
    {
      provide: OutboundEmailSender,
      useExisting: LoggingOutboundEmailSender,
    },
    {
      provide: EmailVerificationUrlPolicy,
      useExisting: EnvironmentEmailVerificationUrlPolicy,
    },
    {
      provide: EmailVerificationTokenRepository,
      useExisting: PrismaEmailVerificationTokenRepository,
    },
    {
      provide: SessionRepository,
      useExisting: PrismaSessionRepository,
    },
    {
      provide: RequestRateLimiter,
      useExisting: InMemoryRequestRateLimiter,
    },
    {
      provide: PasswordPolicy,
      useExisting: MinimumPasswordPolicy,
    },
    {
      provide: PasswordRegistrationRepository,
      useExisting: PrismaPasswordRegistrationRepository,
    },
    {
      provide: PasswordHasher,
      useExisting: NodeScryptPasswordHasher,
    },
    {
      provide: PasswordCredentialRepository,
      useExisting: PrismaPasswordCredentialRepository,
    },
    {
      provide: RequestAuthenticationAdapter,
      useExisting: OpaqueSessionAuthenticationAdapter,
    },
  ],
})
export class AppModule {}
