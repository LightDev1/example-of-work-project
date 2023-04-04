import { UserOS } from 'src/modules/users/enums/UserOS';
import { ClientCard } from '../models/client-card.entity';

export const isClientOsIsIOS = (client: ClientCard): boolean =>
  client.os === UserOS.IOS;
export const isClientOsIsAndroid = (client: ClientCard): boolean =>
  client.os === UserOS.ANDROID;
