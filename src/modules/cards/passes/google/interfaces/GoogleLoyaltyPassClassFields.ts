import { ClassTemplateInfo } from './ClassTemplateInfo';

export interface GoogleLoyaltyPassClassFields {
  classSuffix: string;
  issuerName: string;
  reviewStatus?: 'UNDER_REVIEW';
  programName: string;
  programLogoUri: string;
  programLogoDescription?: string;
  heroImageUri?: string;
  heroImageDescription?: string;
  hexBackgroundColor?: string;
  classTemplateInfo?: ClassTemplateInfo;
}
