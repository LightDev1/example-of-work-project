import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, FilterOperator } from 'nestjs-paginate';
import { ClientGooglePassService } from 'src/modules/cards/passes/google/client-google-pass.service';
import { CardsService } from 'src/modules/cards/services/cards.service';
import { BaseCrudService } from 'src/modules/shared/base-crud/services/base-crud.service';
import { User } from 'src/modules/users/models/user.entity';
import { isUserOwner } from 'src/modules/users/predicats/roles';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ClientCard } from '../models/client-card.entity';
import { isClientOsIsAndroid, isClientOsIsIOS } from '../predicats/os';

@Injectable()
export class ClientCardsService extends BaseCrudService<ClientCard> {
  constructor(
    @InjectRepository(ClientCard)
    repository: Repository<ClientCard>,
    private readonly cardsService: CardsService,
    private readonly clientGooglePassSerivice: ClientGooglePassService,
  ) {
    super(repository);
  }

  public async create(data: Partial<ClientCard>): Promise<ClientCard> {
    const firstBonusLevelOfCard =
      await this.cardsService.getFirstLevelOfBonusSystem(data.card.id);
    return super.create({ ...data, level: firstBonusLevelOfCard });
  }

  public getOne(id: string): Promise<ClientCard> {
    return super.getOne(id, {
      relations: ['card', 'card.bonus_levels', 'level'],
    });
  }

  public getClientCards(
    query: PaginateQuery,
    user?: User,
  ): Promise<Paginated<ClientCard>> {
    const clientCardsQb = this.repository
      .createQueryBuilder('client_card')
      .leftJoinAndSelect('client_card.card', 'card')
      .leftJoinAndSelect('card.company_owner', 'company_owner');

    const clientCardsQbWithRole = this.applyRoleToQb(clientCardsQb, user);

    return super.getMany(query, clientCardsQbWithRole, {
      relations: ['card', 'level'],
      sortableColumns: ['created_at'],
      filterableColumns: {
        phone: [FilterOperator.EQ],
        'card.id': [FilterOperator.EQ],
      },
      maxLimit: 50,
    });
  }

  public async changeBonusLevelOf(id: string): Promise<void> {
    const clientCard = await this.getOne(id);
    const currentLevel = clientCard.level;
    const currentLevelTransferAmout = currentLevel.transfer_amount || 0;
    const levels = clientCard.card.bonus_levels;

    const newLevel = levels.find(
      (level) =>
        level.transfer_amount <= clientCard.purchases_amount &&
        !(level.transfer_amount < currentLevelTransferAmout) &&
        !(level.id === currentLevel.id),
    );
    if (newLevel) {
      await this.addBonusLevelOf(clientCard.id, newLevel.id);
      await this.updateClientWalletCard(clientCard, { level: newLevel });
    }
  }

  public async addBonusLevelOf(
    clientCardId: string,
    levelId: string,
  ): Promise<void> {
    return this.repository
      .createQueryBuilder()
      .relation(ClientCard, 'level')
      .of(clientCardId)
      .set(levelId);
  }

  public async increaseBalanceOf(
    id: string,
    purchaseAmount: number,
  ): Promise<void> {
    const clientCard = await this.getOne(id);
    const balance = Math.round(
      clientCard.balance + purchaseAmount * (clientCard.level.bonus / 100),
    );
    await super.update(clientCard.id, {
      balance,
    });
    await this.updateClientWalletCard(clientCard, { balance });
  }

  public async writeOffBalanceOf(
    id: string,
    writtenOffBonuses: number,
  ): Promise<void> {
    const clientCard = await this.getOne(id);
    const balance = clientCard.balance - writtenOffBonuses;
    await super.update(id, {
      balance,
    });
    await this.updateClientWalletCard(clientCard, { balance });
  }

  public async increasePurchasesAmountOf(
    id: string,
    purchasesAmout: number,
  ): Promise<void> {
    const clientCard = await this.getOne(id);
    await super.update(id, {
      purchases_amount: clientCard.purchases_amount + purchasesAmout,
    });
  }

  public getRepo(): Repository<ClientCard> {
    return this.repository;
  }

  private async updateClientWalletCard(
    clientCard: ClientCard,
    data: Partial<ClientCard>,
  ): Promise<void> {
    if (data.level) {
      if (isClientOsIsAndroid(clientCard)) {
        await this.clientGooglePassSerivice.updateCardObjectBonusLevel(
          clientCard.id,
          data.level,
        );
      }
    }
    if (data.balance) {
      if (isClientOsIsAndroid(clientCard)) {
        await this.clientGooglePassSerivice.updateCardObjectBalance(
          clientCard.id,
          data.balance,
        );
      }
    }
  }

  private applyRoleToQb(
    qb: SelectQueryBuilder<ClientCard>,
    user: User,
  ): SelectQueryBuilder<ClientCard> {
    if (user && isUserOwner(user)) {
      qb.andWhere('company_owner.id = :userId', { userId: user.id });
    }
    return qb;
  }
}
