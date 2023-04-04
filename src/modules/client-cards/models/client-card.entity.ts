import { ApiProperty } from '@nestjs/swagger';
import { UserOS } from 'src/modules/users/enums/UserOS';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientGender } from '../enums/ClientGender';
import { ClientCardRelations } from './client-card.relations';

@Entity('client_card')
export class ClientCard extends ClientCardRelations {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'myemail@gmail.com', required: true })
  @Column('varchar')
  email!: string;

  @ApiProperty({ example: 'Имя', required: false })
  @Column('varchar', { nullable: true })
  first_name!: string;

  @ApiProperty({ example: 'Фамилия', required: false })
  @Column('varchar', { nullable: true })
  last_name!: string;

  @ApiProperty({ example: '+71111111111', required: false })
  @Column('varchar', { nullable: true })
  phone!: string;

  @ApiProperty({ example: '2002-12-02', required: false })
  @Column('varchar')
  birth_date!: string;

  @ApiProperty({ required: false })
  @Column('integer', { default: 0 })
  purchases_amount!: number;

  @ApiProperty({ required: false })
  @Column('integer', { default: 0 })
  balance!: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @ApiProperty({ example: ClientGender.MALE, enum: ClientGender })
  @Column('enum', { enum: ClientGender, nullable: true })
  gender!: ClientGender;

  @ApiProperty({ example: UserOS.ANDROID })
  @Column('enum', { enum: UserOS, nullable: true })
  os!: UserOS;
}
