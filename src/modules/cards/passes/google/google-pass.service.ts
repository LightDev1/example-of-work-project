import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GaxiosResponse } from 'gaxios';
import { GoogleAuth } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import * as jwt from 'jsonwebtoken';
import { ClientCard } from 'src/modules/client-cards/models/client-card.entity';
import { getConfigVariable } from 'src/modules/core/configs/helpers';
import { Card } from '../../models/card.entity';
import * as keyFile from './credentials/loyality-cards-3ebbb929e48b.json';
import { BarcodeType } from './enums/BarcodeType';
import { CardRowTemplateInfosType } from './enums/CardRowTemplateInfosType';
import { CirillicCardProgram } from './enums/CirillicCardProgram';
import { GoogleAdditionalData } from './interfaces/GoogleAdditionalData';
import { GooglePass } from './pass';
import { GoogleLoyaltyPassClassTemplate } from './templates/loyalty-pass.template';

@Injectable()
export class GooglePassService {
  private issuerId: string;
  private googleAuthScope: string;
  private baseUrl: string;
  private classUrl: string;
  private objectUrl: string;
  private credentials: any;
  private httpClient: GoogleAuth<JSONClient>;

  constructor() {
    this.issuerId = getConfigVariable('GOOGLE_WALLET_ISSUER_ID');
    this.baseUrl = getConfigVariable('GOOGLE_WALLET_API_URL');
    this.googleAuthScope = getConfigVariable('GOOGLE_AUTH_SCOPE');
    this.classUrl = `${this.baseUrl}/loyaltyClass`;
    this.objectUrl = `${this.baseUrl}/loyaltyObject`;

    this.auth();
  }
  public auth() {
    this.credentials = keyFile;

    this.httpClient = new GoogleAuth({
      credentials: this.credentials,
      scopes: this.googleAuthScope,
    });
  }

  public async createClass(classSuffix: string, data: Card): Promise<object> {
    try {
      const cardClass = await this.getPassClass(classSuffix);
      return cardClass.data;
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        throw new BadRequestException(error.message);
      }
    }

    const passClass = new GoogleLoyaltyPassClassTemplate({
      classSuffix,
      issuerName: data.company_owner.company_name,
      programName: CirillicCardProgram[data.type],
      programLogoUri:
        'https://sun9-9.userapi.com/impg/eUEkTiWVdqOD0sVx2od9B717j7W0XT_DQecElg/3mKILPnSyK4.jpg?size=160x160&quality=95&sign=cc03115ebbd7fde4cc58f71c95b43ca1&type=album',
      heroImageUri:
        'https://sun9-77.userapi.com/impg/p8CtRiOVfdvy9cf2wA-mmHz1tCvOwdZ_qWtHUA/yk8-1vT1T9g.jpg?size=180x120&quality=96&sign=3964fad5ea0b05e533feba4cf63380a9&type=album',
      hexBackgroundColor: `#${data.bg_color}`,
    });
    passClass.overrideCardTemplate(CardRowTemplateInfosType.THREE_ITEMS, {
      startItemFieldPath: "object.textModulesData['balance']",
      middleItemFieldPath: "object.textModulesData['full_name']",
      endItemFieldPath: "object.textModulesData['cashback']",
    });

    console.log(passClass);
    try {
      const { data: cardClass } = await this.httpClient.request({
        url: this.classUrl,
        method: 'POST',
        data: passClass,
      });
      return cardClass;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async patchClass(classSuffix, data: Partial<GoogleLoyaltyPassClassTemplate>) {
    try {
      await this.getPassClass(classSuffix);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        throw new NotFoundException(
          `Class ${this.issuerId}.${classSuffix} not found!`,
        );
      } else {
        throw new BadRequestException(err.message);
      }
    }
    const { data: passClass } = await this.httpClient.request({
      url: `${this.classUrl}/${this.issuerId}.${classSuffix}`,
      method: 'PATCH',
      data,
    });
    return passClass;
  }

  public async createObject(
    classSuffix,
    objectSuffix,
    data: Card & GoogleAdditionalData,
    clientCard: ClientCard,
  ) {
    const clientFullName = `${clientCard.first_name} ${clientCard.last_name}`;
    try {
      const { data: card } = await this.getPassObject(objectSuffix);
      return card;
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        throw new BadRequestException(err);
      }
    }

    const passCard = new GooglePass({
      objectSuffix,
      classSuffix,
      barcode: {
        type: BarcodeType.QR_CODE,
        value: clientCard.id,
      },
      accountId: clientCard.id,
      accountName: clientFullName,
      textModulesData: data.textModulesData,
      linksModuleData: data.linksModuleData,
    });

    try {
      const { data: card } = await this.httpClient.request({
        url: this.objectUrl,
        method: 'POST',
        data: passCard,
      });
      return card;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async patchObject(
    objectSuffix,
    data: Partial<GooglePass>,
  ): Promise<GooglePass> {
    try {
      await this.getPassObject(objectSuffix);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        throw new NotFoundException('Object was not found');
      } else {
        throw new BadRequestException(err.message);
      }
    }
    const { data: passObject } = await this.httpClient.request({
      url: `${this.objectUrl}/${this.issuerId}.${objectSuffix}`,
      method: 'PATCH',
      data,
    });
    return passObject;
  }

  public async expireObject(objectSuffix) {
    try {
      await this.getPassObject(objectSuffix);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        throw new NotFoundException('Object not found');
      } else {
        throw new BadRequestException(err.message);
      }
    }
    const patchBody = {
      state: 'EXPIRED',
    };
    const { data: passObject } = await this.httpClient.request({
      url: `${this.objectUrl}/${this.issuerId}.${objectSuffix}`,
      method: 'PATCH',
      data: patchBody,
    });
    return passObject;
  }

  public createJwt(classObject: object, cardObject: object) {
    const claims = {
      iss: this.credentials.client_email,
      aud: 'google',
      origins: ['www.example.com'],
      typ: 'savetowallet',
      payload: {
        loyaltyClasses: [classObject],
        loyaltyObjects: [cardObject],
      },
    };
    const token = jwt.sign(claims, this.credentials.private_key, {
      algorithm: 'RS256',
    });
    return `https://pay.google.com/gp/v/save/${token}`;
  }

  private getPassClass(classSuffix: string): Promise<GaxiosResponse<any>> {
    return this.httpClient.request({
      url: `${this.classUrl}/${this.issuerId}.${classSuffix}`,
      method: 'GET',
    });
  }

  public getPassObject(
    objectSuffix: string,
  ): Promise<GaxiosResponse<GooglePass>> {
    return this.httpClient.request({
      url: `${this.objectUrl}/${this.issuerId}.${objectSuffix}`,
      method: 'GET',
    });
  }
}
