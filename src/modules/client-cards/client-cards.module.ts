import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsModule } from '../cards/cards.module';
import { ClientCard } from './models/client-card.entity';
import { ClientCardsService } from './services/client-cards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientCard]),
    forwardRef(() => CardsModule),
  ],
  providers: [ClientCardsService],
  exports: [ClientCardsService],
})
export class ClientCardsModule {}
