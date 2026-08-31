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
import { AuthenticationIdentityRepository } from './auth/authentication-identity.repository.js';
import { AuthenticationIdentityService } from './auth/authentication-identity.service.js';
import { PrismaAuthenticationIdentityRepository } from './auth/prisma-authentication-identity.repository.js';
import { PasswordCredentialRepository } from './auth/password-credential.repository.js';
import { PrismaPasswordCredentialRepository } from './auth/prisma-password-credential.repository.js';
import { RequestAuthenticationAdapter } from './auth/authentication-adapter.js';
import { RequestPrincipalResolver } from './auth/request-principal-resolver.js';
import { DatabaseModule } from './database/database.module.js';
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
  controllers: [HealthController, AccountActivationController, VerificationAccessController, CapabilityAccessController, AccountLookupController, AuthenticatedAccountLookupController, AuthenticatedAccountActivationController, AuthenticatedAccountDeletionRequestController],
  providers: [EffectiveSafetyRestrictionService, AuthenticatedCapabilityDecisionService, AuthenticatedCapabilityAccessService, AuthenticatedAccountActivationService, AuthenticatedAccountDeletionRequestService, AuthenticatedAccountContextService, AccountDeletionRequestService,
    HealthStatusService,
    CapabilityAccessService,
    AccountActivationService,
    VerificationAccessService,
    AccountLookupService,
    RequestPrincipalResolver,
    PrismaAccountRepository,
    PrismaAuthenticationIdentityRepository,
    PrismaPasswordCredentialRepository,
    PrismaVerificationRepository,
    PrismaSafetyEnforcementRepository,
    VerificationService,
    VerificationLevelAccessService,
    VerificationCapabilityAccessService,
    AuthenticationIdentityService,
    AnonymousAuthenticationAdapter,
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
      provide: PasswordCredentialRepository,
      useExisting: PrismaPasswordCredentialRepository,
    },
    {
      provide: RequestAuthenticationAdapter,
      useExisting: AnonymousAuthenticationAdapter,
    },
  ],
})
export class AppModule {}
