import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusLevel } from '../bonus-levels/models/bonus-level.entity';
import { CardStatisticsModule } from '../card-statistics/card-statistics.module';
import { ClientCardsModule } from '../client-cards/client-cards.module';
import { AdditionalInformation } from './models/additional-information.entity';
import { Card } from './models/card.entity';
import { ApplePassService } from './passes/apple/apple-pass.service';
import { ClientGooglePassService } from './passes/google/client-google-pass.service';
import { GooglePassService } from './passes/google/google-pass.service';
import { CardsService } from './services/cards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, AdditionalInformation, BonusLevel]),
    forwardRef(() => CardStatisticsModule),
    ClientCardsModule,
  ],
  providers: [
    CardsService,
    ApplePassService,
    GooglePassService,
    ClientGooglePassService,
  ],
  exports: [
    CardsService,
    ApplePassService,
    GooglePassService,
    ClientGooglePassService,
  ],
})
export class CardsModule {}
