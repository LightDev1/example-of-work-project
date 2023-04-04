import { ApiProperty } from '@nestjs/swagger';
import { BonusLevel } from 'src/modules/bonus-levels/models/bonus-level.entity';
import { Card } from 'src/modules/cards/models/card.entity';
import { ManyToOne } from 'typeorm';

export class ClientCardRelations {
  @ApiProperty({ type: () => Card })
  @ManyToOne(() => Card, (card) => card.client_cards, { onDelete: 'CASCADE' })
  card!: Card;

  @ApiProperty({ type: () => BonusLevel })
  @ManyToOne(() => BonusLevel)
  level!: BonusLevel;
}
