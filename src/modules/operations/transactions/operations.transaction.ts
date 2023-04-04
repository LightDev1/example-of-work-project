import { Injectable } from '@nestjs/common';
import { BonusLevel } from 'src/modules/bonus-levels/models/bonus-level.entity';
import { ClientCardsService } from 'src/modules/client-cards/services/client-cards.service';
import { BaseTransaction } from 'src/modules/shared/base-crud/transactions/base.transaction';
import { Connection, EntityManager } from 'typeorm';
import { CreateOperationDto } from '../dto/CreateOperationDto';
import { Operation } from '../models/operation.entity';

@Injectable()
export class CreateOperationTransaction extends BaseTransaction<
  CreateOperationDto,
  Operation
> {
  constructor(
    connection: Connection,
    private readonly clientCardsService: ClientCardsService,
  ) {
    super(connection);
  }

  protected async execute(
    data: CreateOperationDto,
    manager: EntityManager,
  ): Promise<Operation> {
    const accuredBonuses = this.calculateAccuredBonuses(data);
    const clientCurrentLevelBonus = await this.getClientCurrentLevelBonus(
      data.client_card.id,
    );
    const operation = await manager.create(Operation, {
      ...data,
      accured_bonuses: accuredBonuses,
      client_current_level_bonus: clientCurrentLevelBonus,
    });
    const savedOperation = await manager.save(operation);
    await this.applyOperationResults(data);
    return savedOperation;
  }

  private async applyOperationResults(data: CreateOperationDto): Promise<void> {
    const clientCardId = data.client_card.id;
    await this.clientCardsService.increasePurchasesAmountOf(
      clientCardId,
      data.purchase_amount,
    );
    await this.clientCardsService.writeOffBalanceOf(
      clientCardId,
      data.written_off_bonuses,
    );
    await this.clientCardsService.increaseBalanceOf(
      clientCardId,
      data.purchase_amount,
    );
    await this.clientCardsService.changeBonusLevelOf(clientCardId);
  }

  private calculateAccuredBonuses(data: CreateOperationDto): number {
    const clientCard = data.client_card;
    return Math.round(data.purchase_amount * (clientCard.level.bonus / 100));
  }

  private async getClientCurrentLevelBonus(
    clientCardId: string,
  ): Promise<number> {
    const { level } = await this.clientCardsService.getOne(clientCardId);
    return level.bonus;
  }
}
