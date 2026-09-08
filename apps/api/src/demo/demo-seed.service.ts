import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { createGeographicScope } from '@universal/domain';
import { PrismaAccountRepository } from '../accounts/prisma-account.repository.js';
import { CategoryService } from '../profiles/category.service.js';
import { ProfileService } from '../profiles/profile.service.js';
import { PrismaMatchTransitionRepository } from '../matching/prisma-match-transition.repository.js';
import { PrismaConversationRepository } from '../messaging/prisma-conversation.repository.js';
import { PrismaMessageRepository } from '../messaging/prisma-message.repository.js';
import { InitialAdministratorProvisioningService } from '../administration/initial-administrator-provisioning.service.js';
import { createDemoSeedPlan } from './demo-seed-plan.js';

@Injectable()
export class DemoSeedService {
  constructor(
    private readonly accounts: PrismaAccountRepository,
    private readonly categories: CategoryService,
    private readonly profiles: ProfileService,
    private readonly matches: PrismaMatchTransitionRepository,
    private readonly conversations: PrismaConversationRepository,
    private readonly messages: PrismaMessageRepository,
    private readonly administrators: InitialAdministratorProvisioningService,
  ) {}

  async seed(): Promise<void> {
    const category = await this.ensureCategory();
    const ids = {
      memberA: randomUUID(),
      memberB: randomUUID(),
      memberC: randomUUID(),
      administrator: randomUUID(),
    };
    await Promise.all(Object.values(ids).map((id) => this.accounts.create({ id, status: 'active' })));
    await this.profiles.create({ accountId: ids.memberA, categoryId: category.id, fields: { displayName: 'Demo Member A' }, geographicScope: createGeographicScope({ kind: 'country', countryCode: 'JP' }) });
    await this.profiles.create({ accountId: ids.memberB, categoryId: category.id, fields: { displayName: 'Demo Member B' }, geographicScope: createGeographicScope({ kind: 'country', countryCode: 'JP' }) });
    await this.profiles.create({ accountId: ids.memberC, categoryId: category.id, fields: { displayName: 'Demo Member C' }, geographicScope: createGeographicScope({ kind: 'country', countryCode: 'US' }) });
    await this.matches.transition({ actorAccountId: ids.memberA, targetAccountId: ids.memberB, decision: 'like', idempotencyKey: randomUUID() });
    await this.matches.transition({ actorAccountId: ids.memberB, targetAccountId: ids.memberA, decision: 'like', idempotencyKey: randomUUID() });
    const conversation = await this.conversations.createOrFindDirect(ids.memberA, ids.memberB);
    await this.messages.createForParticipant({ conversationId: conversation.id, senderAccountId: ids.memberA, body: 'Welcome to the fictional demo.' });
    await this.administrators.provision(ids.administrator);
  }

  private async ensureCategory() {
    const key = 'demo-general';
    const existing = (await this.categories.list()).find((category) => category.key === key);
    return existing ?? this.categories.create({ key, displayName: 'Demo General' });
  }

  plan() {
    return createDemoSeedPlan();
  }
}
