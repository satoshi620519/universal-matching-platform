import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { PasswordRecoveryRepository, type PasswordRecoveryRecord, type PasswordRecoveryStatus } from './password-recovery.repository.js';

@Injectable()
export class PrismaPasswordRecoveryRepository extends PasswordRecoveryRepository {
  constructor(private readonly database: DatabaseService) { super(); }

  async create(input: Omit<PasswordRecoveryRecord,'consumedAt'|'revokedAt'>): Promise<PasswordRecoveryRecord> {
    const record=await this.database.passwordRecoveryRequest.create({data:{id:input.id,authenticationIdentityId:input.authenticationIdentityId,secretHash:input.secretHash,status:input.status,requestedAt:input.requestedAt,expiresAt:input.expiresAt}});
    return this.toRecord(record);
  }
  async findById(id:string):Promise<PasswordRecoveryRecord|null> {
    const record=await this.database.passwordRecoveryRequest.findUnique({where:{id}});
    return record?this.toRecord(record):null;
  }
  async consume(id:string,consumedAt:Date):Promise<void> {
    await this.database.passwordRecoveryRequest.updateMany({where:{id,status:'active',consumedAt:null,revokedAt:null},data:{status:'consumed',consumedAt}});
  }
  async revokeActiveForAuthenticationIdentity(authenticationIdentityId:string,revokedAt:Date):Promise<void> {
    await this.database.passwordRecoveryRequest.updateMany({where:{authenticationIdentityId,status:'active',revokedAt:null},data:{status:'revoked',revokedAt}});
  }
  private toRecord(record:{id:string;authenticationIdentityId:string;secretHash:string;status:string;requestedAt:Date;expiresAt:Date;consumedAt:Date|null;revokedAt:Date|null}):PasswordRecoveryRecord {
    return {...record,status:record.status as PasswordRecoveryStatus};
  }
}