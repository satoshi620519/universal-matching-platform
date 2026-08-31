import { Module } from '@nestjs/common';
import { AccountRepository } from './account.repository.js';
import { AccountLookupController } from './account-lookup.controller.js';
import { AccountLookupService } from './account-lookup.service.js';

@Module({
  controllers: [AccountLookupController],
  providers: [AccountLookupService, AccountRepository],
  exports: [AccountLookupService],
})
export class AccountLookupModule {}
