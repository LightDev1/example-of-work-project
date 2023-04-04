import { BadRequestException, Injectable } from '@nestjs/common';
import { Pass, Template } from '@walletpass/pass-js';
import { PassStyle } from '@walletpass/pass-js/dist/interfaces';
import { getConfigVariable } from 'src/modules/core/configs/helpers';
import AppFile from 'src/modules/core/files/models/file.entity';
import { AppFilesService } from 'src/modules/core/files/services/files.service';
import { Card } from '../../models/card.entity';
import { CardsService } from '../../services/cards.service';
import { PassType } from './enums/PassType';
import { promises as fs } from 'fs';
import * as path from 'path';
import { UPLOAD_FOLDER } from 'src/modules/core/files/constants/folders';
import { getRandomName } from 'src/modules/core/files/helpers/random-name';
import { ClientCardsService } from 'src/modules/client-cards/services/client-cards.service';
import { ClientCard } from 'src/modules/client-cards/models/client-card.entity';

@Injectable()
export class ApplePassService {
  constructor(
    private readonly filesService: AppFilesService,
    private readonly cardsService: CardsService,
    private readonly clientCardsService: ClientCardsService,
  ) {}

  public async createPass(
    clientCardId: string,
    cardId: string,
  ): Promise<AppFile> {
    const clientCard = await this.clientCardsService.getOne(clientCardId);
    const card = await this.cardsService.getOne(cardId);
    const template = await this.createTemplate(card);

    const pass = template.createPass({
      serialNumber: clientCardId,
    });
    const styledPass = this.stylePass(pass, clientCard);
    return this.generatePkPassFileLocal(styledPass);
  }

  private async createTemplate(data: Card): Promise<Template> {
    const passStyle = PassType[data.type] as PassStyle;
    const description = this.generateDescription(data);
    const template = new Template(passStyle, {
      passTypeIdentifier: getConfigVariable('APPLE_PASS_TYPE_IDENTIFIER'),
      teamIdentifier: getConfigVariable('APPLE_PASS_TEAM_IDENTIFIER'),
      description,
      organizationName: data.company_owner.company_name,
      backgroundColor: `#${data.bg_color}`,
    });

    if (!data.ios_logo && !data.ios_cover) {
      throw new BadRequestException('Добавьте обложку и логитип для карты');
    }

    await template.images.add('logo', data.ios_logo.key);
    await template.images.add('icon', data.ios_logo.key);
    await template.images.add('strip', data.ios_cover.key);

    const certificate = getConfigVariable('APPLE_PASS_CERTIFICATE');
    const privateKey = getConfigVariable('APPLE_PASS_CERTIFICATE_PRIVATE_KEY');

    template.setCertificate(certificate);
    template.setPrivateKey(privateKey);
    return template;
  }

  private async generatePkPassFileLocal(pass: Pass): Promise<AppFile> {
    const passBuffer = await pass.asBuffer();
    const filePath = path.join(
      path.join('/', UPLOAD_FOLDER),
      `${getRandomName()}.pkpass`,
    );
    const fileAbsPath = `.${filePath}`;
    await fs.writeFile(fileAbsPath, passBuffer);
    return this.filesService.createForExisting(fileAbsPath);
  }

  private generateDescription(card: Card): string {
    const additionalInformation = card.additional_information;
    const description = additionalInformation.reduce(
      (result, info) => (result += `${info.value} \n`),
      '',
    );
    if (!description) {
      return 'Нет дополнительной информации';
    }
    return description;
  }

  private stylePass(pass: Pass, clientCard: ClientCard): Pass {
    pass.headerFields.add({
      key: 'level',
      label: 'Уровень',
      value: clientCard.level.title,
    });
    pass.secondaryFields.add({
      key: 'balance',
      label: 'Баланс',
      value: clientCard.balance,
    });
    pass.secondaryFields.add({
      key: 'full_name',
      label: 'ФИО',
      value: `${clientCard.first_name} ${clientCard.last_name}`,
    });
    pass.secondaryFields.add({
      key: 'cashback',
      label: 'Кэшбэк',
      value: clientCard.level.bonus,
    });
    pass.barcodes = [
      {
        format: 'PKBarcodeFormatQR',
        message: clientCard.id,
        messageEncoding: 'iso-8859-1',
      },
    ];
    return pass;
  }
}
