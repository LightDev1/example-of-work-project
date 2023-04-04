import { AdditionalInformationType } from '../enums/AdditionalInformationType';
import { AdditionalInformation } from '../models/additional-information.entity';

export const isInfoTextType = (info: AdditionalInformation): boolean =>
  info.type == AdditionalInformationType.TEXT;

export const isInfoLinkType = (info: AdditionalInformation): boolean =>
  info.type == AdditionalInformationType.LINK;

export const isInfoPhoneType = (info: AdditionalInformation): boolean =>
  info.type == AdditionalInformationType.PHONE;

export const isInfoEmailType = (info: AdditionalInformation): boolean =>
  info.type == AdditionalInformationType.EMAIL;
