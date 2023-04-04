import { ApiProperty } from '@nestjs/swagger';
import { Card } from 'src/modules/cards/models/card.entity';
import { ClientCard } from 'src/modules/client-cards/models/client-card.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('bonus-level')
export class BonusLevel {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'Title' })
  @Column('varchar')
  title!: string;

  @ApiProperty({ example: 400 })
  @Column('integer')
  bonus!: number;

  @ApiProperty({ required: false, example: 100 })
  @Column('integer', { nullable: true })
  transfer_amount!: number;

  @ApiProperty({ type: () => Card, required: false })
  @ManyToOne(() => Card, (card) => card.bonus_levels, { onDelete: 'CASCADE' })
  card!: Card;

  @ApiProperty({ type: () => ClientCard, isArray: true })
  @OneToMany(() => ClientCard, (clientCard) => clientCard.level)
  client_cards!: ClientCard[];
}
