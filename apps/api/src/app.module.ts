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
import { RoleAssignmentMutationService } from './administration/role-assignment-mutation.service.js';
import { AdministrativeCapabilityAccessService } from './administration/administrative-capability-access.service.js';
import { AdministrativeRoleManagementService } from './administration/administrative-role-management.service.js';
import { InitialAdministratorProvisioningService } from './administration/initial-administrator-provisioning.service.js';
import { PrivilegedFailedEmailOutboxService } from './administration/privileged-failed-email-outbox.service.js';
import { AdministrativeFailedEmailOutboxController } from './administration/administrative-failed-email-outbox.controller.js';
import { AdministrativeRoleManagementController } from './administration/administrative-role-management.controller.js';
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
import { ConfigurationVersionRepository } from './configuration/configuration-version.repository.js';
import { PrismaConfigurationVersionRepository } from './configuration/prisma-configuration-version.repository.js';
import { ConfigurationPublicationService } from './configuration/configuration-publication.service.js';
import { ConfigurationSettingDefinitionProvider } from './configuration/configuration-setting-definition.provider.js';
import { InMemoryConfigurationSettingDefinitionProvider } from './configuration/in-memory-configuration-setting-definition.provider.js';
import { ConfigurationValueRepository } from './configuration/configuration-value.repository.js';
import { PrismaConfigurationValueRepository } from './configuration/prisma-configuration-value.repository.js';
import { ConfigurationDraftEditingService } from './configuration/configuration-draft-editing.service.js';
import { ConfigurationEffectiveValueRepository } from './configuration/configuration-effective-value.repository.js';
import { PrismaConfigurationEffectiveValueRepository } from './configuration/prisma-configuration-effective-value.repository.js';
import { ConfigurationEffectiveValueService } from './configuration/configuration-effective-value.service.js';
import { ConfigurationReversionService } from './configuration/configuration-reversion.service.js';
import { PrismaProfileRepository } from './profiles/prisma-profile.repository.js';
import { PrismaDiscoveryProfileRepository } from './profiles/prisma-discovery-profile.repository.js';
import { ProfileService } from './profiles/profile.service.js';
import { DiscoveryService } from './profiles/discovery.service.js';
import { AllowAllDiscoveryExclusionPolicy, DiscoveryExclusionPolicy } from './profiles/discovery-exclusion.policy.js';
import { CategoryService } from './profiles/category.service.js';
import { PrismaCategoryRepository } from './profiles/prisma-category.repository.js';
import { PrismaMatchTransitionRepository } from './matching/prisma-match-transition.repository.js';
import { MessagingController } from './messaging/messaging.controller.js';
import { PrismaConversationRepository } from './messaging/prisma-conversation.repository.js';
import { PrismaMessageRepository } from './messaging/prisma-message.repository.js';
import { PrismaNotificationRepository } from './messaging/prisma-notification.repository.js';
import { RealtimePublisher } from './realtime/realtime-publisher.js';
import { SseRealtimePublisher } from './realtime/sse-realtime-publisher.js';
import { MessageRealtimePublicationService } from './messaging/message-realtime-publication.service.js';
import { RealtimeController } from './realtime/realtime.controller.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AdministrativeRoleManagementController, AdministrativeFailedEmailOutboxController, HealthController, PasswordRegistrationController, EmailVerificationController, PasswordSignInController, SessionController, AccountActivationController, VerificationAccessController, CapabilityAccessController, AccountLookupController, AuthenticatedAccountLookupController, AuthenticatedAccountActivationController, AuthenticatedAccountDeletionRequestController, MessagingController, RealtimeController],
  providers: [PrismaMatchTransitionRepository, PrismaConversationRepository, PrismaMessageRepository, PrismaNotificationRepository, MessageRealtimePublicationService, SseRealtimePublisher, AllowAllDiscoveryExclusionPolicy, DiscoveryService, PrismaDiscoveryProfileRepository, CategoryService, ProfileService, PrismaProfileRepository, PrismaCategoryRepository, ConfigurationReversionService, ConfigurationEffectiveValueService, PrismaConfigurationEffectiveValueRepository, ConfigurationDraftEditingService, PrismaConfigurationValueRepository, InMemoryConfigurationSettingDefinitionProvider, ConfigurationPublicationService, PrismaConfigurationVersionRepository, InitialAdministratorProvisioningService, AdministrativeRoleAccessService, PrivilegedFailedEmailOutboxService, AdministrativeCapabilityAccessService, AdministrativeRoleManagementService, RoleAssignmentMutationService, AuditRecordService, PrismaRoleAssignmentRepository, PrismaAuditRecordRepository, EffectiveSafetyRestrictionService, AuthenticatedCapabilityDecisionService, AuthenticatedCapabilityAccessService, AuthenticatedAccountActivationService, AuthenticatedAccountDeletionRequestService, AuthenticatedAccountContextService, AccountDeletionRequestService,
    HealthStatusService, CapabilityAccessService, AccountActivationService, VerificationAccessService, AccountLookupService, RequestPrincipalResolver, PrismaAccountRepository, PrismaAuthenticationIdentityRepository, PrismaPasswordCredentialRepository, PrismaPasswordRegistrationRepository, PasswordRegistrationService, PasswordRegistrationTransportService, PasswordSignInService, EmailVerificationService, EmailVerificationDeliveryService, EmailOutboxDispatchService, EmailOutboxWorker, EmailOutboxProcessService, FailedEmailOutboxReviewService, PrismaEmailOutboxRepository, PrismaFailedEmailOutboxRepository, LoggingOutboundEmailSender, EnvironmentEmailVerificationUrlPolicy, PrismaEmailVerificationTokenRepository, PasswordSignInTransportService, SessionIssuanceService, SessionRevocationService, PrismaSessionRepository, MinimumPasswordPolicy, InMemoryRequestRateLimiter, NodeScryptPasswordHasher, PrismaVerificationRepository, PrismaSafetyEnforcementRepository, VerificationService, VerificationLevelAccessService, VerificationCapabilityAccessService, AuthenticationIdentityService, AnonymousAuthenticationAdapter, OpaqueSessionAuthenticationAdapter,
    { provide: ConfigurationEffectiveValueRepository, useExisting: PrismaConfigurationEffectiveValueRepository },
    { provide: ConfigurationValueRepository, useExisting: PrismaConfigurationValueRepository },
    { provide: ConfigurationSettingDefinitionProvider, useExisting: InMemoryConfigurationSettingDefinitionProvider },
    { provide: ConfigurationVersionRepository, useExisting: PrismaConfigurationVersionRepository },
    { provide: AuditRecordRepository, useExisting: PrismaAuditRecordRepository },
    { provide: RoleAssignmentRepository, useExisting: PrismaRoleAssignmentRepository },
    { provide: AccountRepository, useExisting: PrismaAccountRepository },
    { provide: SafetyEnforcementRepository, useExisting: PrismaSafetyEnforcementRepository },
    { provide: VerificationRepository, useExisting: PrismaVerificationRepository },
    { provide: AuthenticationIdentityRepository, useExisting: PrismaAuthenticationIdentityRepository },
    { provide: FailedEmailOutboxRepository, useExisting: PrismaFailedEmailOutboxRepository },
    { provide: EmailOutboxRepository, useExisting: PrismaEmailOutboxRepository },
    { provide: OutboundEmailSender, useExisting: LoggingOutboundEmailSender },
    { provide: EmailVerificationUrlPolicy, useExisting: EnvironmentEmailVerificationUrlPolicy },
    { provide: EmailVerificationTokenRepository, useExisting: PrismaEmailVerificationTokenRepository },
    { provide: SessionRepository, useExisting: PrismaSessionRepository },
    { provide: RequestRateLimiter, useExisting: InMemoryRequestRateLimiter },
    { provide: PasswordPolicy, useExisting: MinimumPasswordPolicy },
    { provide: PasswordRegistrationRepository, useExisting: PrismaPasswordRegistrationRepository },
    { provide: PasswordHasher, useExisting: NodeScryptPasswordHasher },
    { provide: DiscoveryExclusionPolicy, useExisting: AllowAllDiscoveryExclusionPolicy },
    { provide: RealtimePublisher, useExisting: SseRealtimePublisher },
    { provide: RequestAuthenticationAdapter, useExisting: OpaqueSessionAuthenticationAdapter },
  ],
})
export class AppModule {}
