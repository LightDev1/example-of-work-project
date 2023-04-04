import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, FilterOperator } from 'nestjs-paginate';
import { BonusLevel } from 'src/modules/bonus-levels/models/bonus-level.entity';
import { getConfigVariable } from 'src/modules/core/configs/helpers';
import { GetCardReceivingLinkResponseDto } from 'src/modules/owner/cards/dto/GetCardReceivingLinkResponseDto';
import { BaseCrudService } from 'src/modules/shared/base-crud/services/base-crud.service';
import { User } from 'src/modules/users/models/user.entity';
import { Repository } from 'typeorm';
import { CardStatus } from '../enums/CardStatus';
import { AdditionalInformation } from '../models/additional-information.entity';
import { Card } from '../models/card.entity';

@Injectable()
export class CardsService extends BaseCrudService<Card> {
  constructor(
    @InjectRepository(Card) repository: Repository<Card>,
    @InjectRepository(AdditionalInformation)
    private readonly additionalInformationRepository: Repository<AdditionalInformation>,
    @InjectRepository(BonusLevel)
    private readonly bonusLevelRepository: Repository<BonusLevel>,
  ) {
    super(repository);
  }

  public createCard(data: Partial<Card>, user: User): Promise<Card> {
    return super.create({ ...data, company_owner: user });
  }

  public getCards(query: PaginateQuery, user?: User): Promise<Paginated<Card>> {
    const cardsQb = this.repository
      .createQueryBuilder('card')
      .leftJoinAndSelect('card.company_owner', 'company_owner');

    if (user) {
      cardsQb.andWhere('company_owner.id = :userId', { userId: user.id });
    }

    return super.getMany(query, cardsQb, {
      relations: [
        'additional_information',
        'android_cover',
        'android_logo',
        'bonus_levels',
        'ios_cover',
        'ios_logo',
        'company_owner',
      ],
      defaultSortBy: [['created_at', 'DESC']],
      sortableColumns: ['id', 'created_at', 'updated_at'],
      filterableColumns: { 'company_owner.id': [FilterOperator.EQ] },
    });
  }

  public getOne(id: string): Promise<Card> {
    return super.getOne(id, {
      relations: [
        'additional_information',
        'android_cover',
        'android_logo',
        'bonus_levels',
        'ios_cover',
        'ios_logo',
        'company_owner',
      ],
    });
  }

  public updateStatus(id: string, status: CardStatus): Promise<Card> {
    return super.update(id, { status });
  }

  public async addAdditionalInformation(
    cardIdOrCard: string | Card,
    informations: AdditionalInformation[],
  ): Promise<void> {
    if (informations && informations.length) {
      const additionalInformations =
        await this.additionalInformationRepository.save(informations);
      return super.createRelation(
        Card,
        cardIdOrCard,
        'additional_information',
        additionalInformations,
      );
    }
  }

  public async update(id: string, data: Partial<Card>): Promise<Card> {
    const card = await super.getOne(id);
    await this.addBonusLevel(card, data.bonus_levels);
    await this.addAdditionalInformation(card, data.additional_information);
    const { additional_information, bonus_levels, ...updateData } = data;
    await super.update(id, updateData);
    return this.getOne(id);
  }

  public async removeAdditionalInformation(
    informationId: string,
  ): Promise<void> {
    await this.additionalInformationRepository.delete(informationId);
  }

  public async getFirstLevelOfBonusSystem(id: string): Promise<BonusLevel> {
    const card = await this.getOne(id);
    const levels = card.bonus_levels;
    if (levels && levels.length) {
      const firstLevel = levels.reduce((levelA, levelB) => {
        if (levelA.bonus < levelB.bonus) {
          return levelA;
        } else {
          return levelB;
        }
      });
      return firstLevel;
    }
  }

  public getAllCards(): Promise<Card[]> {
    return this.repository.find({
      relations: [
        'additional_information',
        'android_cover',
        'android_logo',
        'bonus_levels',
        'ios_cover',
        'ios_logo',
        'company_owner',
      ],
    });
  }

  private async addBonusLevel(
    cardIdOrCard: string | Card,
    bonusLevels: BonusLevel[],
  ): Promise<void> {
    if (bonusLevels && bonusLevels.length) {
      const levels = await this.bonusLevelRepository.save(bonusLevels);
      return super.createRelation(Card, cardIdOrCard, 'bonus_levels', levels);
    }
  }

  public async getCardReceivingLink(
    id: string,
    user?: User,
  ): Promise<GetCardReceivingLinkResponseDto> {
    const cardQb = this.repository
      .createQueryBuilder('card')
      .leftJoinAndSelect('card.company_owner', 'company_owner')
      .where('card.id = :cardId', {
        cardId: id,
      });

    if (user) {
      cardQb.andWhere('company_owner.id = :ownerId', { ownerId: user.id });
    }

    const card = await cardQb.getOne();

    if (card) {
      const frontUrl = getConfigVariable('FRONT_URL');
      const link = `${frontUrl}/cards/${id}`;
      return { link };
    }
    throw new BadRequestException(
      'Такой карты не существует или у вас нет доступа к этому функционалу',
    );
  }
}
