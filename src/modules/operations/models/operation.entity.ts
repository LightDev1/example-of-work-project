import { ApiProperty } from '@nestjs/swagger';
import { ClientCard } from 'src/modules/client-cards/models/client-card.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('operation')
export class Operation {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 1000 })
  @Column('integer')
  product_cost!: number;

  @ApiProperty({ example: 960 })
  @Column('integer')
  purchase_amount!: number;

  @ApiProperty({ example: 40 })
  @Column('integer')
  written_off_bonuses!: number;

  @ApiProperty({ example: 25 })
  @Column('integer')
  accured_bonuses!: number;

  @ApiProperty({ example: '952845358328825' })
  @Column('varchar')
  check_number!: string;

  @ApiProperty()
  @Column('integer', { nullable: true })
  client_current_level_bonus!: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @ApiProperty()
  @ManyToOne(() => ClientCard)
  @JoinColumn()
  client_card!: ClientCard;
}
