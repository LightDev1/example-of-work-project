import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { BonusLevel } from 'src/modules/bonus-levels/models/bonus-level.entity';
import { ClientCard } from 'src/modules/client-cards/models/client-card.entity';
import { ClientCardsService } from 'src/modules/client-cards/services/client-cards.service';
import { GetGooglePassLinkDto } from 'src/modules/client/client-cards/dto/GetGooglePasLinkDto';
import { Card } from '../../models/card.entity';
import {
  isInfoLinkType,
  isInfoPhoneType,
  isInfoTextType,
} from '../../predicats/additional-information';
import { CardsService } from '../../services/cards.service';
import { GooglePassService } from './google-pass.service';
import { GoogleAdditionalData } from './interfaces/GoogleAdditionalData';

@Injectable()
export class ClientGooglePassService {
  constructor(
    private readonly googlePassService: GooglePassService,
    private readonly cardsService: CardsService,
    @Inject(forwardRef(() => ClientCardsService))
    private readonly clientCardsService: ClientCardsService,
  ) {}

  public async createPass(
    clientCardId: string,
    cardId: string,
  ): Promise<GetGooglePassLinkDto> {
    const clientCard = await this.clientCardsService.getOne(clientCardId);
    const card = await this.cardsService.getOne(cardId);
    const additionalData = this.getAdditionalData(card, clientCard);
    const classSuffix = card.id;
    const objectSuffix = clientCardId;
    try {
      const cardClass = await this.googlePassService.createClass(
        classSuffix,
        card,
      );
      const cardObject = await this.googlePassService.createObject(
        classSuffix,
        objectSuffix,
        { ...card, ...additionalData },
        clientCard,
      );
      const link = await this.googlePassService.createJwt(
        cardClass,
        cardObject,
      );
      return { link };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Ошибка при создании карты');
    }
  }

  private getAdditionalData(
    card: Card,
    clientCard: ClientCard,
  ): GoogleAdditionalData {
    const clientFullName = `${clientCard.first_name} ${clientCard.last_name}`;
    const additionalInformation = card.additional_information;
    const initialAdditionalData = { textModulesData: [], linksModuleData: [] };
    const additionalData = additionalInformation.reduce((result, info) => {
      if (isInfoTextType(info)) {
        result.textModulesData.push({
          header: info.title,
          body: info.value,
          id: info.id,
        });
        return result;
      }
      if (isInfoLinkType(info) || isInfoPhoneType(info)) {
        result.linksModuleData.push({
          description: info.title,
          uri: info.value,
          id: info.id,
        });
        return result;
      }
      return result;
    }, initialAdditionalData);
    return {
      textModulesData: [
        {
          id: 'balance',
          header: 'Баланс',
          body: clientCard.balance,
        },
        {
          id: 'full_name',
          header: 'ФИО',
          body: clientFullName,
        },
        {
          id: 'cashback',
          header: 'Кэшбэк',
          body: `${clientCard.level.bonus}%`,
        },
        {
          id: 'level',
          header: '',
          body: `${clientCard.level.title}`,
        },
        ...additionalData.textModulesData,
      ],
      linksModuleData: {
        uris: additionalData.linksModuleData,
      },
    };
  }

  public async updateCardObjectBalance(
    objectSuffix: string,
    balance: number,
  ): Promise<void> {
    try {
      const { data: passObject } = await this.googlePassService.getPassObject(
        objectSuffix,
      );
      const textModulesData = passObject.textModulesData;
      const balanceDataIndex = textModulesData.findIndex(
        (balanceData) => balanceData.id === 'balance',
      );
      passObject.textModulesData[balanceDataIndex].body = balance;
      await this.googlePassService.patchObject(objectSuffix, passObject);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async updateCardObjectBonusLevel(
    objectSuffix: string,
    level: BonusLevel,
  ): Promise<void> {
    try {
      const { data: passObject } = await this.googlePassService.getPassObject(
        objectSuffix,
      );
      const textModulesData = passObject.textModulesData;
      const levelDataIndex = textModulesData.findIndex(
        (levelData) => levelData.id === 'level',
      );
      passObject.textModulesData[levelDataIndex].body = level.title;
      await this.googlePassService.patchObject(objectSuffix, passObject);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
