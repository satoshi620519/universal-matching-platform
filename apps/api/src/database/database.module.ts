import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service.js';
import { createMigrationExecutor, MIGRATION_EXECUTOR } from './migration-executor.provider.js';

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: MIGRATION_EXECUTOR,
      useFactory: createMigrationExecutor,
      inject: [DatabaseService],
    },
  ],
  exports: [DatabaseService, MIGRATION_EXECUTOR],
})
export class DatabaseModule {}
