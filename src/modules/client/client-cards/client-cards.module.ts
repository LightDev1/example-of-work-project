import { Module } from '@nestjs/common';
import { CardsModule } from 'src/modules/cards/cards.module';
import { ClientCardsModule } from 'src/modules/client-cards/client-cards.module';
import { ClientClientCardsController } from './controllers/client-cards.controller';

@Module({
  imports: [ClientCardsModule, CardsModule],
  controllers: [ClientClientCardsController],
})
export class ClientClientCardsModule {}
