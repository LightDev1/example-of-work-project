import { getConfigVariable } from 'src/modules/core/configs/helpers';
import { Barcode } from './interfaces/Barcode';
import { PassFields } from './interfaces/PassFields';
import { TextModuleDataInterface } from './interfaces/TextModuleDataInterface';
import { LinksModuleDataInterface } from './interfaces/LinksModuleDataInterface';
import { LoyaltyPoints } from './interfaces/LoyaltyPoints';

export class GooglePass {
  id: string;
  issuerId: string;
  classId: string;
  state: 'ACTIVE' | 'EXPIRED';
  barcode: Barcode;
  accountId: string;
  accountName: string;
  textModulesData: TextModuleDataInterface[];
  linksModuleData: LinksModuleDataInterface;

  secondaryLoyaltyPoints: LoyaltyPoints;

  constructor(fields: PassFields) {
    this.issuerId = getConfigVariable('GOOGLE_WALLET_ISSUER_ID');
    this.id = `${this.issuerId}.${fields.objectSuffix}`;
    this.classId = `${this.issuerId}.${fields.classSuffix}`;
    this.state = fields.state || 'ACTIVE';
    this.barcode = fields.barcode;
    this.accountId = fields.accountId;
    this.accountName = fields.accountName;
    this.textModulesData = fields.textModulesData;
    this.linksModuleData = fields.linksModuleData;
    this.secondaryLoyaltyPoints = fields.secondaryLoyaltyPoints;
  }
}
