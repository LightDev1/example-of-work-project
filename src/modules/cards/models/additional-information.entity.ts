import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AdditionalInformationType } from '../enums/AdditionalInformationType';
import { Card } from './card.entity';

@Entity('additional_information')
export class AdditionalInformation {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: AdditionalInformationType.TEXT,
    enum: AdditionalInformationType,
  })
  @Column('enum', {
    enum: AdditionalInformationType,
    default: AdditionalInformationType.TEXT,
  })
  type!: AdditionalInformationType;

  @ApiProperty()
  @Column('varchar')
  title!: string;

  @ApiProperty()
  @Column('varchar')
  value!: string;

  @ApiProperty({ type: () => Card })
  @ManyToOne(() => Card, (card) => card.additional_information, {
    onDelete: 'CASCADE',
  })
  card!: Card;
}
