import { CardRowTemplateInfosOneItem } from './CardRowTemplateInfosOneItem';
import { CardRowTemplateInfosThreeItems } from './CardRowTemplateInfosThreeItems';
import { CardRowTemplateInfosTwoItems } from './CardRowTemplateInfosTwoItems';

export interface ClassTemplateInfo {
  cardTemplateOverride?: {
    cardRowTemplateInfos:
      | CardRowTemplateInfosOneItem[]
      | CardRowTemplateInfosTwoItems[]
      | CardRowTemplateInfosThreeItems[]
      | (CardRowTemplateInfosOneItem | CardRowTemplateInfosTwoItems)[]
      | (CardRowTemplateInfosOneItem | CardRowTemplateInfosThreeItems)[];
  };
}
