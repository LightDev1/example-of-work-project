import { getConfigVariable } from 'src/modules/core/configs/helpers';
import { CardRowTemplateInfosType } from '../enums/CardRowTemplateInfosType';
import { CardRowTemplateInfosOneItem } from '../interfaces/CardRowTemplateInfosOneItem';
import { CardRowTemplateInfosThreeItems } from '../interfaces/CardRowTemplateInfosThreeItems';
import { CardRowTemplateInfosTwoItems } from '../interfaces/CardRowTemplateInfosTwoItems';
import { ClassTemplateInfo } from '../interfaces/ClassTemplateInfo';
import { GoogleLoyaltyPassClassFields } from '../interfaces/GoogleLoyaltyPassClassFields';
import { ItemFieldsPaths } from '../interfaces/ItemFieldsPaths';
import { SourceUri } from '../interfaces/SourceUri';

export class GoogleLoyaltyPassClassTemplate {
  id: string;
  issuerId: string;
  issuerName: string;
  reviewStatus: 'UNDER_REVIEW';
  programName: string;
  programLogo: { sourceUri: SourceUri; description?: string };
  heroImage: { sourceUri: SourceUri; description?: string };
  hexBackgroundColor: string;
  classTemplateInfo: ClassTemplateInfo;

  constructor(fields: GoogleLoyaltyPassClassFields) {
    this.issuerId = getConfigVariable('GOOGLE_WALLET_ISSUER_ID');
    this.id = `${this.issuerId}.${fields.classSuffix}`;
    this.issuerName = fields.issuerName;
    this.reviewStatus = fields.reviewStatus || 'UNDER_REVIEW';
    this.programName = fields.programName;
    this.programLogo = {
      sourceUri: {
        uri: fields.programLogoUri,
      },
      description: fields.programLogoDescription || '',
    };
    this.heroImage = {
      sourceUri: {
        uri: fields.heroImageUri,
      },
      description: fields.heroImageDescription || '',
    };
    this.hexBackgroundColor = fields.hexBackgroundColor;
    this.classTemplateInfo = fields.classTemplateInfo;
  }

  public overrideCardTemplate(
    type: CardRowTemplateInfosType,
    fields: ItemFieldsPaths,
  ): void {
    switch (type) {
      case CardRowTemplateInfosType.ONE_ITEM:
        this.classTemplateInfo = {
          cardTemplateOverride: {
            cardRowTemplateInfos: [
              {
                oneItem: {
                  item: {
                    firstValue: {
                      fields: [
                        {
                          fieldPath: fields.startItemFieldPath,
                        },
                      ],
                    },
                  },
                },
              } as CardRowTemplateInfosOneItem,
            ],
          },
        };
        return;
      case CardRowTemplateInfosType.TWO_ITEMS:
        this.classTemplateInfo = {
          cardTemplateOverride: {
            cardRowTemplateInfos: [
              {
                twoItems: {
                  startItem: {
                    firstValue: {
                      fields: [
                        {
                          fieldPath: fields.startItemFieldPath,
                        },
                      ],
                    },
                  },
                  endItem: {
                    firstValue: {
                      fields: [
                        {
                          fieldPath: fields.endItemFieldPath,
                        },
                      ],
                    },
                  },
                },
              } as CardRowTemplateInfosTwoItems,
            ],
          },
        };
        return;
      case CardRowTemplateInfosType.THREE_ITEMS:
        this.classTemplateInfo = {
          cardTemplateOverride: {
            cardRowTemplateInfos: [
              {
                oneItem: {
                  item: {
                    firstValue: {
                      fields: [
                        {
                          fieldPath: "object.textModulesData['level']",
                        },
                      ],
                    },
                  },
                },
              } as CardRowTemplateInfosOneItem,
              {
                threeItems: {
                  startItem: {
                    firstValue: {
                      fields: [
                        {
                          fieldPath: fields.startItemFieldPath,
                        },
                      ],
                    },
                  },
                  middleItem: {
                    firstValue: {
                      fields: [
                        {
                          fieldPath: fields.middleItemFieldPath,
                        },
                      ],
                    },
                  },
                  endItem: {
                    firstValue: {
                      fields: [
                        {
                          fieldPath: fields.endItemFieldPath,
                        },
                      ],
                    },
                  },
                },
              } as CardRowTemplateInfosThreeItems,
            ],
          },
        };
        return;
      default:
        break;
    }
  }
}
