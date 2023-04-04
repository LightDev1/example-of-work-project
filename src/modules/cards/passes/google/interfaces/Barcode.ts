import { BarcodeType } from '../enums/BarcodeType';

export interface Barcode {
  type: BarcodeType;
  value: string | number;
}
