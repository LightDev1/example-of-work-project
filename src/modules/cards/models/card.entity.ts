import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardStatus } from '../enums/CardStatus';
import { CardType } from '../enums/CardType';
import { CardRelations } from './card.relations';

@Entity('card')
export class Card extends CardRelations {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ enum: CardType, example: CardType.BONUS })
  @Column('enum', { enum: CardType, default: CardType.BONUS })
  type!: CardType;

  @ApiProperty()
  @Column('varchar')
  title!: string;

  @ApiProperty({ example: 30 })
  @Column('integer')
  bonus_pay_limit!: number;

  @ApiProperty({ example: 90 })
  @Column('integer')
  bonus_destroy_days!: number;

  @ApiProperty({ required: false })
  @Column('boolean', { default: false })
  is_referral_enabled!: boolean;

  @ApiProperty({ required: false, example: 90 })
  @Column('integer', { nullable: true })
  referral_bonus_destroy_days!: number;

  @ApiProperty({ required: false, example: 10 })
  @Column('integer', { nullable: true })
  referral_bonus_value!: number;

  @ApiProperty({ required: false, example: '#ed51ed' })
  @Column('varchar', { nullable: true })
  bg_color!: string;

  @ApiProperty({
    required: false,
    example: CardStatus.ACTIVE,
    enum: CardStatus,
  })
  @Column('enum', { enum: CardStatus, default: CardStatus.DISABLED })
  status!: CardStatus;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
