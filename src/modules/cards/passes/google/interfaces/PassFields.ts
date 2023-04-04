import { Barcode } from './Barcode';
import { LinksModuleDataInterface } from './LinksModuleDataInterface';
import { LoyaltyPoints } from './LoyaltyPoints';
import { TextModuleDataInterface } from './TextModuleDataInterface';

export interface PassFields {
  objectSuffix: string;
  classSuffix: string;
  state?: 'ACTIVE' | 'EXPIRED';
  barcode?: Barcode;
  accountId?: string;
  accountName?: string;
  textModulesData?: TextModuleDataInterface[];
  linksModuleData?: LinksModuleDataInterface;
  secondaryLoyaltyPoints?: LoyaltyPoints;
}
