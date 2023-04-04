import { ApiProperty } from '@nestjs/swagger';
import { BonusLevel } from 'src/modules/bonus-levels/models/bonus-level.entity';
import { ClientCard } from 'src/modules/client-cards/models/client-card.entity';
import AppFile from 'src/modules/core/files/models/file.entity';
import { CardStatistics } from 'src/modules/card-statistics/models/card-statistics.entity';
import { User } from 'src/modules/users/models/user.entity';
import {
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AdditionalInformation } from './additional-information.entity';

export class CardRelations {
  @ApiProperty({ type: () => AppFile, required: false })
  @OneToOne(() => AppFile)
  @JoinColumn()
  ios_logo!: AppFile;

  @ApiProperty({ type: () => AppFile, required: false })
  @OneToOne(() => AppFile)
  @JoinColumn()
  android_logo!: AppFile;

  @ApiProperty({ type: () => AppFile, required: false })
  @OneToOne(() => AppFile)
  @JoinColumn()
  ios_cover!: AppFile;

  @ApiProperty({ type: () => AppFile, required: false })
  @OneToOne(() => AppFile)
  @JoinColumn()
  android_cover!: AppFile;

  @ApiProperty({ type: () => BonusLevel, required: false, isArray: true })
  @OneToMany(() => BonusLevel, (bonusLevel) => bonusLevel.card, {
    cascade: true,
  })
  bonus_levels!: BonusLevel[];

  @ApiProperty({ type: () => AdditionalInformation, isArray: true })
  @OneToMany(
    () => AdditionalInformation,
    (additionalInformation) => additionalInformation.card,
    { cascade: true },
  )
  additional_information!: AdditionalInformation[];

  @ApiProperty({ type: () => ClientCard, isArray: true })
  @OneToMany(() => ClientCard, (clientCard) => clientCard.card, {
    cascade: true,
  })
  client_cards!: ClientCard[];

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.cards, { onDelete: 'CASCADE' })
  company_owner!: User;

  @OneToOne(() => CardStatistics, (statistics) => statistics.card, {
    cascade: true,
  })
  statistics!: CardStatistics;
}
