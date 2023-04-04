import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientCardsModule } from '../client-cards/client-cards.module';
import { OperationsController } from './controllers/operations.controller';
import { Operation } from './models/operation.entity';
import { OperationsService } from './services/operations.service';
import { CreateOperationTransaction } from './transactions/operations.transaction';
import { IsWriteOffBonusesValidConstraint } from './validations/operations.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Operation]), ClientCardsModule],
  controllers: [OperationsController],
  providers: [
    OperationsService,
    IsWriteOffBonusesValidConstraint,
    CreateOperationTransaction,
  ],
  exports: [OperationsService],
})
export class OperationsModule {}
